import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
    path: 'dashboard',
    loadChildren: () => import('../app/dashboard').then(m => m.DashboardModule),
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
