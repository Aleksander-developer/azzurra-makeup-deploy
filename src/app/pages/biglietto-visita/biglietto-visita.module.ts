import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BigliettoVisitaRoutingModule } from './biglietto-visita-routing.module';
import { BigliettoVisitaComponent } from './biglietto-visita.component';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    BigliettoVisitaComponent
  ],
  imports: [
    CommonModule,
    BigliettoVisitaRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class BigliettoVisitaModule { }
