import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
// Il percorso di import è più semplice ora
import { PortfolioManagerComponent } from './portfolio-manager/portfolio-manager.component'; 

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      // La rotta per il portfolio manager
      { path: 'portfolio-manager', component: PortfolioManagerComponent },

      // Reindirizzamento di default
      { path: '', redirectTo: 'portfolio-manager', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }