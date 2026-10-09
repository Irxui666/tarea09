import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { VentaDetalle } from './venta-detalle';
const venta = {
  id: 7,
  fecha: '2026-10-09T10:00:00',
  clienteId: 1,
  clienteNombre: 'Ana Huamán',
  estado: 'ANULADA',
  total: 7.5,
  detalles: [
    { productoId: 1, productoNombre: 'Paracetamol', cantidad: 3, precio: 2.5, subtotal: 7.5 },
  ],
};
describe('VentaDetalle', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [VentaDetalle],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }),
  );
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
  it('mantiene el comprobante aunque falle la carga del DNI', () => {
    const f = TestBed.createComponent(VentaDetalle);
    f.componentRef.setInput('id', '7');
    f.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('/api/v1/ventas/7').flush(venta);
    http
      .expectOne('/api/v1/clientes/1')
      .flush({ message: 'No encontrado' }, { status: 404, statusText: 'Not Found' });
    f.detectChanges();
    expect(f.componentInstance.venta()?.total).toBe(7.5);
    expect(f.componentInstance.cliente()).toBeNull();
    expect(f.nativeElement.textContent).toContain('ANULADA');
    expect(f.nativeElement.textContent).toContain('000007');
  });
  it('imprime automáticamente después de obtener venta y DNI', () => {
    vi.useFakeTimers();
    const imprimir = vi.spyOn(window, 'print').mockImplementation(() => {});
    const f = TestBed.createComponent(VentaDetalle);
    f.componentRef.setInput('id', '7');
    f.componentRef.setInput('imprimir', '1');
    f.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('/api/v1/ventas/7').flush(venta);
    expect(imprimir).not.toHaveBeenCalled();
    http.expectOne('/api/v1/clientes/1').flush({ id: 1, dni: '12345678' });
    f.detectChanges();
    vi.runAllTimers();
    expect(imprimir).toHaveBeenCalledTimes(1);
    expect(f.nativeElement.textContent).toContain('12345678');
    expect(f.nativeElement.querySelector('.pie').textContent).toContain('Gracias por su compra');
  });
});
