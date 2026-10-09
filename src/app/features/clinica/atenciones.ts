import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ClinicaApi, Atencion, AtencionRequest, Paciente, Procedimiento } from './clinica-api';
import { mensajeError, erroresDeValidacion } from '../../core/utils/http-error';

@Component({
  selector: 'app-atenciones',
  imports: [FormsModule, DecimalPipe, DatePipe],
  templateUrl: './atenciones.html',
})
export class Atenciones {
  private readonly api = inject(ClinicaApi);
  readonly rows = signal<Atencion[]>([]);
  readonly pacientes = signal<Paciente[]>([]);
  readonly procedimientos = signal<Procedimiento[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly ready = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly validation = signal<Record<string, string>>({});
  readonly editing = signal(false);
  readonly selected = signal<Atencion | null>(null);
  filtros: Record<string, string | number> = {
    pacienteId: '',
    estado: '',
    desde: '',
    hasta: '',
    ordenarPor: 'fecha',
    direccion: 'desc',
  };
  model = this.empty();
  constructor() {
    this.loadCatalogs();
    this.load();
  }
  private empty(): AtencionRequest {
    return {
      pacienteId: 0,
      medicoTratante: '',
      motivoConsulta: '',
      diagnostico: '',
      codigoCie10: '',
      detalles: [{ procedimientoId: 0, cantidad: 1 }],
    };
  }
  loadCatalogs() {
    this.ready.set(false);
    forkJoin({
      pacientes: this.api.list<Paciente>('pacientes'),
      procedimientos: this.api.list<Procedimiento>('procedimientos'),
    }).subscribe({
      next: (data) => {
        this.pacientes.set(data.pacientes);
        this.procedimientos.set(data.procedimientos.filter((p) => p.estado));
        this.ready.set(true);
      },
      error: (e) => this.error.set(mensajeError(e)),
    });
  }
  load() {
    this.loading.set(true);
    this.error.set('');
    this.api.list<Atencion>('atenciones', this.filtros).subscribe({
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
  newAtencion() {
    this.model = this.empty();
    this.validation.set({});
    this.success.set('');
    this.selected.set(null);
    this.editing.set(true);
  }
  tarifa(id: number) {
    return this.procedimientos().find((p) => p.id === id)?.tarifa ?? 0;
  }
  total() {
    return this.model.detalles.reduce(
      (sum, d) => sum + this.tarifa(d.procedimientoId) * d.cantidad,
      0,
    );
  }
  validDetails() {
    return (
      this.model.pacienteId > 0 &&
      this.model.detalles.length > 0 &&
      this.model.detalles.every(
        (d) => d.procedimientoId > 0 && Number.isInteger(d.cantidad) && d.cantidad > 0,
      )
    );
  }
  save() {
    if (!this.validDetails() || this.saving()) return;
    this.saving.set(true);
    this.error.set('');
    this.validation.set({});
    const body = {
      ...this.model,
      medicoTratante: this.model.medicoTratante.trim(),
      motivoConsulta: this.model.motivoConsulta.trim(),
      diagnostico: this.model.diagnostico.trim(),
      codigoCie10: this.model.codigoCie10.trim(),
    };
    this.api.save<Atencion>('atenciones', body).subscribe({
      next: (result) => {
        this.saving.set(false);
        this.editing.set(false);
        this.selected.set(result);
        this.success.set('Atención registrada.');
        this.load();
      },
      error: (e) => {
        this.saving.set(false);
        this.error.set(mensajeError(e));
        this.validation.set(erroresDeValidacion(e));
      },
    });
  }
  anular(row: Atencion) {
    if (!confirm(`¿Anular la atención #${row.id}?`)) return;
    this.saving.set(true);
    this.api.anular(row.id).subscribe({
      next: (result) => {
        this.saving.set(false);
        if (this.selected()?.id === result.id) this.selected.set(result);
        this.success.set('Atención anulada.');
        this.load();
      },
      error: (e) => {
        this.saving.set(false);
        this.error.set(mensajeError(e));
      },
    });
  }
  validationMessages() {
    return Object.values(this.validation());
  }
}
