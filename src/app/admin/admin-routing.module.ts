import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioManagementComponent } from './portfolio-management/portfolio-management.component';

const routes: Routes = [
  {
    path: 'portfolio', // This will correspond to the URL /admin/portfolio
    component: PortfolioManagementComponent
  },
  {
    path: '', // Redirects /admin to /admin/portfolio by default
    redirectTo: 'portfolio',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }