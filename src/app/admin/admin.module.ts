import { NgModule, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { PortfolioManagementComponent } from './portfolio-management/portfolio-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { MatCard } from '@angular/material/card';
import { FileToUrlPipe } from '../pipes/file-to-url.pipe';


@NgModule({
  declarations: [
    PortfolioManagementComponent,
    FileToUrlPipe
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
