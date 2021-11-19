import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutenticationComponent } from "./autentication/autentication.component";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: AutenticationComponent },
  { path: '**', component: AutenticationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
