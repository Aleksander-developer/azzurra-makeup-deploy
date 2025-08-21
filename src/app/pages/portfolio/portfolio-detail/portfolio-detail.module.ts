import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioDetailRoutingModule } from './portfolio-detail-routing.module';
import { MaterialModule } from '../../../material/material.module';
import { PortfolioDetailComponent } from './portfolio-detail.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [
    PortfolioDetailComponent
  ],
  imports: [
    CommonModule,
    PortfolioDetailRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class PortfolioDetailModule { }
