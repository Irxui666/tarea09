import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ClinicaApi, Especialidad } from './clinica-api';
import { mensajeError, erroresDeValidacion } from '../../core/utils/http-error';

interface Field {
  key: string;
  label: string;
  type?: string;
  required?: boolean;
  max?: number;
  min?: number;
  pattern?: string;
}
interface Row {
  id: number;
  estado: boolean;
  especialidad?: Especialidad;
  [key: string]: unknown;
}
const FIELDS: Record<string, Field[]> = {
  especialidades: [
    { key: 'nombre', label: 'Nombre', required: true, max: 50 },
    { key: 'descripcion', label: 'Descripción', max: 200 },
  ],
  pacientes: [
    { key: 'dni', label: 'DNI (8 caracteres)', required: true, max: 8, pattern: '.{8}' },
    { key: 'nombres', label: 'Nombres', required: true, max: 100 },
    { key: 'apellidos', label: 'Apellidos', required: true, max: 100 },
    { key: 'fechaNacimiento', label: 'Fecha de nacimiento', type: 'date', required: true },
    { key: 'sexo', label: 'Sexo', type: 'sexo', required: true },
    { key: 'email', label: 'Correo electrónico', type: 'email', max: 150 },
    { key: 'telefono', label: 'Teléfono', max: 15 },
    { key: 'direccion', label: 'Dirección', max: 250 },
  ],
  procedimientos: [
    { key: 'codigo', label: 'Código', required: true, max: 10 },
    { key: 'nombre', label: 'Nombre', required: true, max: 150 },
    { key: 'tarifa', label: 'Tarifa', type: 'number', required: true, min: 0.01, max: 99999999.99 },
    { key: 'duracionMinutos', label: 'Duración (minutos)', type: 'number', required: true, min: 1, pattern: '[0-9]+' },
    { key: 'especialidadId', label: 'Especialidad', type: 'especialidad', required: true },
  ],
};

@Component({ selector: 'app-catalogo', imports: [FormsModule], templateUrl: './catalogo.html' })
export class Catalogo {
  private readonly api = inject(ClinicaApi);
  readonly recurso = inject(ActivatedRoute).snapshot.data['recurso'] as string;
  readonly titulo = this.recurso[0].toUpperCase() + this.recurso.slice(1);
  readonly fields = FIELDS[this.recurso];
  readonly rows = signal<Row[]>([]);
  readonly especialidades = signal<Especialidad[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly validation = signal<Record<string, string>>({});
  readonly editing = signal(false);
  readonly success = signal('');
  model: Record<string, any> = {};
  id?: number;
  search = '';
  readonly ayer = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();
  constructor() {
    this.load();
    if (this.recurso === 'procedimientos')
      this.api
        .list<Especialidad>('especialidades')
        .subscribe({
          next: (data) => this.especialidades.set(data),
          error: (e) => this.error.set(mensajeError(e)),
        });
  }
  load() {
    this.loading.set(true);
    this.error.set('');
    this.api.list<Row>(this.recurso).subscribe({
      next: (data) => {
        this.rows.set(data);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.loading.set(false);
      },
    });
  }
  filtered() {
    const q = this.search.trim().toLocaleLowerCase();
    return this.rows().filter((r) =>
      this.fields.some((f) => this.cell(r, f.key).toLocaleLowerCase().includes(q)),
    );
  }
  cell(row: Row, key: string): string {
    return key === 'especialidadId' ? (row.especialidad?.nombre ?? '') : String(row[key] ?? '');
  }
  edit(row?: Row) {
    this.id = row?.id;
    this.model = row
      ? { ...row, especialidadId: row.especialidad?.id }
      : { estado: true, sexo: '', especialidadId: '' };
    this.validation.set({});
    this.error.set('');
    this.success.set('');
    this.editing.set(true);
  }
  save() {
    this.saving.set(true);
    this.error.set('');
    this.validation.set({});
    const body: Record<string, unknown> = { estado: this.model['estado'] };
    for (const f of this.fields)
      body[f.key] =
        typeof this.model[f.key] === 'string'
          ? this.model[f.key].trim()
          : (this.model[f.key] ?? '');
    this.api.save<Row>(this.recurso, body, this.id).subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(false);
        this.success.set('Registro guardado.');
        this.load();
      },
      error: (e: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(mensajeError(e));
        this.validation.set(erroresDeValidacion(e));
      },
    });
  }
  deactivate(row: Row) {
    if (!confirm('¿Desactivar este registro? Se conservará su historial.')) return;
    this.saving.set(true);
    this.api.deactivate(this.recurso, row.id).subscribe({
      next: () => {
        this.saving.set(false);
        this.success.set('Registro desactivado.');
        this.load();
      },
      error: (e) => {
        this.saving.set(false);
        this.error.set(mensajeError(e));
      },
    });
  }
}
