import { Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, map, of, switchMap, Subscription } from 'rxjs';
import { VentaService } from '../../services/venta-service';
import { ClienteService } from '../../../clientes/services/cliente-service';
import { Cliente } from '../../../clientes/models/cliente.model';
import { Venta } from '../../models/venta.model';
import { mensajeError } from '../../../../core/utils/http-error';
@Component({
  selector: 'app-venta-detalle',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './venta-detalle.html',
  styleUrl: './venta-detalle.css',
})
export class VentaDetalle implements OnInit, OnDestroy {
  private readonly service = inject(VentaService);
  private readonly clienteService = inject(ClienteService);
  private request?: Subscription;
  private timer?: ReturnType<typeof setTimeout>;
  readonly id = input.required<string>();
  readonly nueva = input<string>();
  readonly imprimir = input<string>();
  readonly venta = signal<Venta | null>(null);
  readonly cliente = signal<Cliente | null>(null);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly fechaImpresion = signal(new Date());
  readonly numero = computed(() => String(this.venta()?.id ?? '').padStart(6, '0'));
  readonly unidades = computed(() =>
    (this.venta()?.detalles ?? []).reduce((s, d) => s + d.cantidad, 0),
  );
  ngOnInit() {
    this.cargar();
  }
  ngOnDestroy() {
    this.request?.unsubscribe();
    if (this.timer) clearTimeout(this.timer);
  }
  cargar() {
    this.request?.unsubscribe();
    this.cargando.set(true);
    this.error.set('');
    this.request = this.service
      .obtener(Number(this.id()))
      .pipe(
        switchMap((venta) =>
          this.clienteService.obtener(venta.clienteId).pipe(
            catchError(() => of(null)),
            map((cliente) => ({ venta, cliente })),
          ),
        ),
      )
      .subscribe({
        next: ({ venta, cliente }) => {
          this.venta.set(venta);
          this.cliente.set(cliente);
          this.cargando.set(false);
          if (this.imprimir() === '1')
            this.timer = setTimeout(() => this.imprimirComprobante(), 300);
        },
        error: (e) => {
          this.cargando.set(false);
          this.error.set(mensajeError(e));
        },
      });
  }
  imprimirComprobante() {
    if (!this.venta()) return;
    this.fechaImpresion.set(new Date());
    this.timer = setTimeout(() => window.print());
  }
}
