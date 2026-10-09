import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { VentaList } from './venta-list';
describe('VentaList', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [VentaList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }),
  );
  afterEach(() => TestBed.inject(HttpTestingController).verify());
  it('rechaza rango inválido sin HTTP', () => {
    const c = TestBed.createComponent(VentaList).componentInstance;
    c.filtros.patchValue({ desde: '2026-10-10', hasta: '2026-10-01' });
    c.buscar();
    expect(c.error()).toContain('posterior');
    TestBed.inject(HttpTestingController).expectNone((r) => r.url.includes('/ventas'));
  });
  it('el total de página excluye ventas anuladas', () => {
    const c = TestBed.createComponent(VentaList).componentInstance;
    c.resultado.set({
      contenido: [
        {
          id: 1,
          fecha: '2026-10-09',
          clienteId: 1,
          clienteNombre: 'Ana',
          estado: 'REGISTRADA',
          total: 12.5,
          detalles: [],
        },
        {
          id: 2,
          fecha: '2026-10-09',
          clienteId: 1,
          clienteNombre: 'Ana',
          estado: 'ANULADA',
          total: 100,
          detalles: [],
        },
      ],
      pagina: 0,
      tamanio: 10,
      totalElementos: 2,
      totalPaginas: 1,
      primera: true,
      ultima: true,
    });
    expect(c.totalPagina()).toBe(12.5);
  });
});
