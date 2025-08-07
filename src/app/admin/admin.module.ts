import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { PortfolioManagerComponent } from './portfolio-manager/portfolio-manager.component';


@NgModule({
  declarations: [
    AdminComponent,
    PortfolioManagerComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
