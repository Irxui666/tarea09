import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}
export interface Paciente {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  sexo: string;
  email: string;
  telefono: string;
  direccion: string;
  estado: boolean;
}
export interface Procedimiento {
  id: number;
  codigo: string;
  nombre: string;
  tarifa: number;
  duracionMinutos: number;
  estado: boolean;
  especialidad: Especialidad;
}
export interface Detalle {
  procedimientoId: number;
  procedimientoNombre: string;
  cantidad: number;
  tarifa: number;
  subtotal: number;
}
export interface Atencion {
  id: number;
  fecha: string;
  pacienteId: number;
  pacienteNombre: string;
  medicoTratante: string;
  motivoConsulta: string;
  diagnostico: string;
  codigoCie10: string;
  estado: 'REGISTRADA' | 'ANULADA';
  total: number;
  detalles: Detalle[];
}
export interface AtencionRequest {
  pacienteId: number;
  medicoTratante: string;
  motivoConsulta: string;
  diagnostico: string;
  codigoCie10: string;
  detalles: { procedimientoId: number; cantidad: number }[];
}
export interface ReporteEspecialidad {
  especialidadId: number;
  especialidadNombre: string;
  cantidadProcedimientos: number;
  montoTotal: number;
}
export interface ReporteProcedimiento {
  procedimientoId: number;
  codigo: string;
  nombre: string;
  especialidadNombre: string;
  cantidadRealizada: number;
  montoTotal: number;
}

@Injectable({ providedIn: 'root' })
export class ClinicaApi {
  private readonly http = inject(HttpClient);
  list<T>(recurso: string, filtros: Record<string, string | number> = {}) {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(filtros))
      if (value !== '') params = params.set(key, value);
    return this.http.get<T[]>(`${environment.apiUrl}/${recurso}`, { params });
  }
  save<T>(recurso: string, body: unknown, id?: number) {
    return id === undefined
      ? this.http.post<T>(`${environment.apiUrl}/${recurso}`, body)
      : this.http.put<T>(`${environment.apiUrl}/${recurso}/${id}`, body);
  }
  deactivate(recurso: string, id: number) {
    return this.http.delete<void>(`${environment.apiUrl}/${recurso}/${id}`);
  }
  anular(id: number) {
    return this.http.patch<Atencion>(`${environment.apiUrl}/atenciones/${id}/anular`, {});
  }
}
