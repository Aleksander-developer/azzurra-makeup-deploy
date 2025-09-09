// src/app/pages/chi-sono/chi-sono.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChiSonoRoutingModule } from './chi-sono-routing.module';
import { ChiSonoComponent } from './chi-sono.component';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    ChiSonoComponent
  ],
  imports: [
    CommonModule,
    ChiSonoRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class ChiSonoModule { }
