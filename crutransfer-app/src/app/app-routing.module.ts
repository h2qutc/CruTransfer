import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('../app/home').then(m => m.HomeModule),
  },
  {
    path: 'login',
    loadChildren: () => import('../app/login').then(m => m.LoginModule),
  },
  {
    path: 'register',
    loadChildren: () => import('../app/register').then(m => m.RegisterModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('../app/dashboard').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'download/:id',
    loadChildren: () => import('../app/download').then(m => m.DownloadModule),
  },
  {
    path: '**', pathMatch: 'full', redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
