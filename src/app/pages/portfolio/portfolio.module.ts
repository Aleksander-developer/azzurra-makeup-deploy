import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioRoutingModule } from './portfolio-routing.module';
import { MaterialModule } from '../../material/material.module';
import { RouterModule } from '@angular/router';
import { PortfolioComponent } from './portfolio.component';


@NgModule({
  declarations: [
    PortfolioComponent
  ],
  imports: [
    CommonModule,
    PortfolioRoutingModule,
    RouterModule,
    MaterialModule
  ]
})
export class PortfolioModule { }
