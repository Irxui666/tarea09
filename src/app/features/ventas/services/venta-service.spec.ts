import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { VentaService } from './venta-service';
describe('VentaService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }),
  );
  afterEach(() => TestBed.inject(HttpTestingController).verify());
  it('omite filtros vacíos y envía página al servidor', () => {
    TestBed.inject(VentaService)
      .buscar({ clienteId: null, estado: null, desde: null, hasta: null }, 2, 10)
      .subscribe();
    const r = TestBed.inject(HttpTestingController).expectOne(
      (r) => r.url === '/api/v1/ventas/buscar',
    );
    expect(r.request.params.keys().sort()).toEqual([
      'direccion',
      'ordenarPor',
      'pagina',
      'tamanio',
    ]);
    expect(r.request.params.get('pagina')).toBe('2');
    r.flush({ contenido: [], pagina: 2 });
  });
  it('envía únicamente los filtros seleccionados', () => {
    TestBed.inject(VentaService)
      .buscar({ clienteId: 3, estado: 'ANULADA', desde: '2026-10-01', hasta: null })
      .subscribe();
    const r = TestBed.inject(HttpTestingController).expectOne(
      (r) => r.url === '/api/v1/ventas/buscar',
    );
    expect(r.request.params.get('clienteId')).toBe('3');
    expect(r.request.params.get('estado')).toBe('ANULADA');
    expect(r.request.params.get('desde')).toBe('2026-10-01');
    expect(r.request.params.has('hasta')).toBe(false);
    r.flush({ contenido: [] });
  });
});
