import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
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
    path: 'forgot-password',
    loadChildren: () => import('../app/forgot-password').then(m => m.ForgotPasswordModule),
  },
  {
    path: 'verify-account/:userId/activate/:code',
    loadChildren: () => import('../app/verify-account').then(m => m.VerifyAccountModule),
  },
  {
    path: 'reset-password',
    loadChildren: () => import('../app/reset-password').then(m => m.ResetPasswordModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('../app/dashboard').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'drive',
    loadChildren: () => import('../app/drive').then(m => m.DriveModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'account',
    loadChildren: () => import('../app/account').then(m => m.AccountModule),
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
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    // preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
