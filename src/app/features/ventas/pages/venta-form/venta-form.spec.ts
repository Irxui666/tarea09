import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { VentaForm } from './venta-form';
import { Producto } from '../../../productos/models/producto.model';
import { Cliente } from '../../../clientes/models/cliente.model';
const cliente: Cliente = {
  id: 1,
  dni: '12345678',
  nombres: 'Ana',
  apellidos: 'Huamán',
  email: 'ana@example.com',
  telefono: null,
  direccion: null,
  estado: true,
  fechaCreacion: '2026-10-09',
  fechaModificacion: null,
};
const producto: Producto = {
  id: 1,
  nombre: 'Paracetamol 500 mg',
  precio: 12.5,
  stock: 5,
  estado: true,
  categoriaId: 1,
  categoriaNombre: 'Analgésicos',
  fechaCreacion: '2026-10-09',
  fechaModificacion: null,
};
describe('VentaForm', () => {
  let fixture: ComponentFixture<VentaForm>, c: VentaForm, http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VentaForm],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(VentaForm);
    c = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne('/api/v1/clientes').flush([cliente, { ...cliente, id: 2, estado: false }]);
    http
      .expectOne('/api/v1/productos')
      .flush([
        producto,
        { ...producto, id: 2, nombre: 'Vitamina', precio: 1.1 },
        { ...producto, id: 3, estado: false },
        { ...producto, id: 4, stock: 0 },
      ]);
    fixture.detectChanges();
  });
  afterEach(() => http.verify());
  it('no confirma una venta vacía', () => {
    c.revisar();
    expect(c.confirmando()).toBe(false);
    expect(c.detalles.invalid).toBe(true);
    http.expectNone('/api/v1/ventas');
  });
  it('busca por palabras sin tildes y excluye clientes inactivos', () => {
    c.buscarCliente.setValue('huaman');
    expect(c.clientesEncontrados().map((x) => x.id)).toEqual([1]);
    c.buscarCliente.setValue('zzzz');
    expect(c.clientesEncontrados()).toEqual([]);
  });
  it('encuentra productos por nombre o categoría y omite agotados e inactivos', () => {
    c.buscarProducto.setValue('para 500');
    expect(c.productosEncontrados().map((x) => x.id)).toEqual([1]);
    c.buscarProducto.setValue('analgesicos');
    expect(c.productosEncontrados().map((x) => x.id)).toEqual([1, 2]);
  });
  it('calcula subtotales, suma duplicados y recalcula al quitar', () => {
    c.agregarProducto(producto);
    c.detalles.at(0).controls.cantidad.setValue(3);
    expect(c.total()).toBe(37.5);
    c.agregarProducto(producto);
    expect(c.detalles.length).toBe(1);
    expect(c.total()).toBe(50);
    c.agregarProducto({ ...producto, id: 2, precio: 1.1 });
    expect(c.total()).toBe(51.1);
    c.quitarLinea(0);
    expect(c.total()).toBe(1.1);
  });
  it('Enter agrega sin revisar ni enviar', () => {
    c.buscarProducto.setValue('para');
    const event = new Event('keydown', { cancelable: true });
    c.agregarPrimero(event);
    expect(event.defaultPrevented).toBe(true);
    expect(c.detalles.length).toBe(1);
    expect(c.confirmando()).toBe(false);
    http.expectNone('/api/v1/ventas');
  });
  it('impide exceder stock, usar cero o cantidades fraccionarias', () => {
    c.elegirCliente(cliente);
    c.agregarProducto(producto);
    for (const cantidad of [6, 0, 1.5]) {
      c.detalles.at(0).controls.cantidad.setValue(cantidad);
      c.revisar();
      expect(c.confirmando()).toBe(false);
    }
  });
  it('Volver conserva los datos sin enviar POST', () => {
    c.elegirCliente(cliente);
    c.agregarProducto(producto);
    c.revisar();
    expect(c.confirmando()).toBe(true);
    c.volver();
    expect(c.confirmando()).toBe(false);
    expect(c.detalles.length).toBe(1);
    http.expectNone('/api/v1/ventas');
  });
  it('solo registra después de confirmar, no duplica envíos y usa la respuesta del servidor', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    c.elegirCliente(cliente);
    c.agregarProducto(producto);
    c.imprimirAlRegistrar.set(false);
    c.confirmar();
    http.expectNone('/api/v1/ventas');
    c.revisar();
    c.confirmar();
    c.confirmar();
    const r = http.expectOne('/api/v1/ventas');
    expect(r.request.method).toBe('POST');
    expect(r.request.body).toEqual({ clienteId: 1, detalles: [{ productoId: 1, cantidad: 1 }] });
    r.flush({ id: 9, total: 12.5 });
    expect(navigate).toHaveBeenCalledWith(['/ventas', 9], { queryParams: { nueva: 1 } });
  });
  it('un 409 permite corregir y refresca stock conservando el detalle', () => {
    c.elegirCliente(cliente);
    c.agregarProducto(producto);
    c.revisar();
    c.confirmar();
    http
      .expectOne('/api/v1/ventas')
      .flush({ message: 'Stock insuficiente' }, { status: 409, statusText: 'Conflict' });
    expect(c.confirmando()).toBe(false);
    expect(c.guardando()).toBe(false);
    expect(c.error()).toBe('Stock insuficiente');
    http.expectOne('/api/v1/productos').flush([{ ...producto, stock: 0 }]);
    expect(c.detalles.length).toBe(1);
    expect(c.lineas()[0].excedeStock).toBe(true);
  });
});
