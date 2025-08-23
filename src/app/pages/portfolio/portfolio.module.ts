import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioRoutingModule } from './portfolio-routing.module';
import { PortfolioComponent } from './portfolio.component';
import { MaterialModule } from '../../material/material.module';
import { PortfolioDetailComponent } from './portfolio-detail/portfolio-detail.component';

@NgModule({
  declarations: [
    PortfolioComponent,
    PortfolioDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PortfolioRoutingModule,
    MaterialModule
  ]
})
export class PortfolioModule { }