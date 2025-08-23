import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // Rotta di default che reindirizza alla home
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  // Lazy loading per ogni pagina
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'portfolio', loadChildren: () => import('./pages/portfolio/portfolio.module').then(m => m.PortfolioModule) },
  { path: 'trucco-sposa', loadChildren: () => import('./pages/trucco-sposa/trucco-sposa.module').then(m => m.TruccoSposaModule) },
  { path: 'chi-sono', loadChildren: () => import('./pages/chi-sono/chi-sono.module').then(m => m.ChiSonoModule) },
  { path: 'contatti', loadChildren: () => import('./pages/contatti/contatti.module').then(m => m.ContattiModule) },
  { path: 'servizi', loadChildren: () => import('./pages/servizi/servizi.module').then(m => m.ServiziModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
{
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard] // <-- PROTECT THIS ROUTE
  },

  // Rotta per pagina non trovata (deve essere l'ultima)
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }