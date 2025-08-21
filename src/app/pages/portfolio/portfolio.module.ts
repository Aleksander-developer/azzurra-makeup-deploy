import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioRoutingModule } from './portfolio-routing.module';
import { MaterialModule } from '../../material/material.module';
import { RouterModule } from '@angular/router';
import { PortfolioComponent } from './portfolio.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    PortfolioComponent
  ],
  imports: [
    CommonModule,
    PortfolioRoutingModule,
    RouterModule,
    SharedModule,
    MaterialModule
  ]
})
export class PortfolioModule { }
