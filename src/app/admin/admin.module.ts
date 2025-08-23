import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { PortfolioManagementComponent } from './portfolio-management/portfolio-management.component';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    PortfolioManagementComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule
  ]
})
export class AdminModule { }
