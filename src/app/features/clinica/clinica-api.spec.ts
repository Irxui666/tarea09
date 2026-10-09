import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ClinicaApi } from './clinica-api';
import { environment } from '../../../environments/environment';

describe('Contrato HTTP de Historia Clínica', () => {
  let api: ClinicaApi;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ClinicaApi);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('envía filtros sin valores vacíos y conserva el ID del paciente', () => {
    api
      .list('atenciones', {
        pacienteId: 7,
        estado: '',
        desde: '2026-01-01',
        ordenarPor: 'fecha',
        direccion: 'desc',
      })
      .subscribe();
    const req = http.expectOne((r) => r.url === `${environment.apiUrl}/atenciones`);
    expect(req.request.params.get('pacienteId')).toBe('7');
    expect(req.request.params.has('estado')).toBe(false);
    expect(req.request.params.get('desde')).toBe('2026-01-01');
    req.flush([]);
  });
  it('registra detalles usando IDs y cantidades sin enviar tarifas calculadas', () => {
    const body = {
      pacienteId: 7,
      medicoTratante: 'Dra. Pérez',
      motivoConsulta: 'Control',
      diagnostico: 'Control general',
      codigoCie10: 'Z00',
      detalles: [{ procedimientoId: 3, cantidad: 2 }],
    };
    api.save('atenciones', body).subscribe();
    const req = http.expectOne(`${environment.apiUrl}/atenciones`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush({ id: 1 });
  });
  it('edita un procedimiento con PUT y su especialidadId', () => {
    api.save('procedimientos', { especialidadId: 4, tarifa: 30.5 }, 2).subscribe();
    const req = http.expectOne(`${environment.apiUrl}/procedimientos/2`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.especialidadId).toBe(4);
    req.flush({});
  });
  it('anula una atención con PATCH', () => {
    api.anular(9).subscribe();
    const req = http.expectOne(`${environment.apiUrl}/atenciones/9/anular`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ estado: 'ANULADA' });
  });
});
