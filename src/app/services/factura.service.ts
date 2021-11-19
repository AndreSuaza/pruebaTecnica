import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { Factura } from '../models/factura.model';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  
  constructor(private http: HttpClient) { }

  getFacturas() {
    const token = localStorage.getItem('token') || '';
    return this.http.get<{ ok: boolean, facturas: Factura[] }>(`${ base_url }/facturas`, {headers:{ 'x-token':token }});
  }

  crearFactura( factura: Factura) {
    const token = localStorage.getItem('token') || '';
    return this.http.post(`${ base_url }/facturas`, factura, {headers:{ 'x-token':token }})
                    .pipe(
                      map( resp => resp ),
                      catchError( error => of(error) )
                    );
  }

  editarFactura( factura: Factura) {
    const token = localStorage.getItem('token') || '';
    return this.http.put(`${ base_url }/facturas/${factura.id}`, factura, {headers:{ 'x-token':token }})
                    .pipe(
                      map( resp => resp ),
                      catchError( error => of(error) )
                    );
  }

  eliminarFactura( factura: Factura) {
    const token = localStorage.getItem('token') || '';
    return this.http.delete(`${ base_url }/facturas/${factura.id}`, {headers:{ 'x-token':token }});
  }

}
