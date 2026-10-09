import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ReporteCategorias } from './reporte-categorias';
describe('ReporteCategorias', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [ReporteCategorias],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }),
  );
  afterEach(() => TestBed.inject(HttpTestingController).verify());
  it('suma montos y cantidades del reporte', () => {
    const f = TestBed.createComponent(ReporteCategorias);
    f.detectChanges();
    const r = TestBed.inject(HttpTestingController).expectOne(
      '/api/v1/reportes/ventas-por-categoria',
    );
    r.flush([
      { categoriaId: 1, nombreCategoria: 'Analgésicos', cantidadTotal: 3, montoTotal: 7.5 },
      { categoriaId: 2, nombreCategoria: 'Vitaminas', cantidadTotal: 2, montoTotal: 2.2 },
    ]);
    expect(f.componentInstance.total()).toBe(9.7);
    expect(f.componentInstance.unidades()).toBe(5);
  });
  it('no consulta fechas invertidas', () => {
    const c = TestBed.createComponent(ReporteCategorias).componentInstance;
    c.filtros.setValue({ desde: '2026-10-10', hasta: '2026-10-01' });
    c.buscar();
    expect(c.error()).toContain('posterior');
    TestBed.inject(HttpTestingController).expectNone((r) => r.url.includes('/reportes'));
  });
});
