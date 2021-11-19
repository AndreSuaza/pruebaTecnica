import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from "../services/usuario.service";
import {Router} from '@angular/router';
@Component({
  selector: 'app-autentication',
  templateUrl: './autentication.component.html'
})
export class AutenticationComponent implements OnInit {

  loginForm = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  
  error : String;

  constructor(private usuarioService: UsuarioService 
            , private router:Router) {
  }

  ngOnInit(): void {
  }

  login() {

    this.usuarioService.login(this.loginForm.get('user').value, this.loginForm.get('password').value)
      .subscribe(res => {
        this.router.navigate(['dashboard']);
      }, (err) => {
        this.error = err.error.msg;
      }
    );

  }

}
