import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio.component';
import { PortfolioDetailComponent } from './portfolio-detail/portfolio-detail.component';

const routes: Routes = [
  {
    path: '',
    component: PortfolioComponent
  },
  {
    path: ':id', // <-- 2. Aggiungi la rotta per il dettaglio
    component: PortfolioDetailComponent // URL: /portfolio/qualunque-id
  }
  // Aggiungeremo la rotta per il dettaglio in seguito
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioRoutingModule { }