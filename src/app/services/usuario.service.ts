import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Usuario } from "../models/usuario.model";
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;

  constructor(private http: HttpClient) { }

  get role() {

    return this.usuario.role;

  }

  login(email, password) {
    return this.http.post(`${ base_url }/login`,  { email, password })
                    .pipe(
                      tap((resp: any) => {
                        localStorage.setItem('token', resp.token);
                        this.usuario = resp.usuario;
                        console.log(this.usuario);
                      })
                    );
  }

  validarToken() : Observable<boolean>{

    const token = localStorage.getItem('token') || '';

    return this.http.get(`${ base_url }/login`, {headers:{ 'x-token':token }})
                    .pipe(
                      map( resp => true ),
                      catchError( error => of(false) )
                    );

  }    

  validarRole()   {
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${ base_url }/login`, {headers:{ 'x-token':token }})
    .pipe(
      map( (resp: any) => (resp.usuario.role == 'ADMIN_ROLE' ? true: false)  ),
      catchError( error => of(false) )
    );
  }

}
