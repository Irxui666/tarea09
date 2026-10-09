import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ClinicaApi, ReporteEspecialidad, ReporteProcedimiento } from './clinica-api';
import { mensajeError } from '../../core/utils/http-error';
@Component({
  selector: 'app-reportes',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './reportes.html',
})
export class Reportes {
  private readonly api = inject(ClinicaApi);
  readonly especialidades = signal<ReporteEspecialidad[]>([]);
  readonly procedimientos = signal<ReporteProcedimiento[]>([]);
  readonly error = signal('');
  readonly loading = signal(false);
  desde = '';
  hasta = '';
  constructor() {
    this.load();
  }
  load() {
    this.loading.set(true);
    this.error.set('');
    const filters = { desde: this.desde, hasta: this.hasta };
    forkJoin({
      e: this.api.list<ReporteEspecialidad>('reportes/atenciones-por-especialidad', filters),
      p: this.api.list<ReporteProcedimiento>('reportes/procedimientos-mas-realizados', filters),
    }).subscribe({
      next: (data) => {
        this.especialidades.set(data.e);
        this.procedimientos.set(data.p);
        this.loading.set(false);
      },
      error: (e) => {
        this.especialidades.set([]);
        this.procedimientos.set([]);
        this.loading.set(false);
        this.error.set(mensajeError(e));
      },
    });
  }
}
