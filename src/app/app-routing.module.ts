import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ClientsPageComponent } from './features/clients/clients-page/clients-page.component';
import { LoginPageComponent } from './features/auth/login-page/login-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  { path: 'login', component: LoginPageComponent },
  
  { 
    path: 'clients', 
    component: ClientsPageComponent,
    canActivate: [AuthGuard]
  },
  
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
