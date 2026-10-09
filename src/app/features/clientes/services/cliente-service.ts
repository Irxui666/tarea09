import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Cliente, ClienteRequest } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/clientes`;

  listar() { return this.http.get<Cliente[]>(this.url); }
  obtener(id: number) { return this.http.get<Cliente>(`${this.url}/${id}`); }
  crear(dto: ClienteRequest) { return this.http.post<Cliente>(this.url, dto); }
  actualizar(id: number, dto: ClienteRequest) { return this.http.put<Cliente>(`${this.url}/${id}`, dto); }
  eliminar(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}
