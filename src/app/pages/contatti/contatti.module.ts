import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContattiRoutingModule } from './contatti-routing.module';
import { ContattiComponent } from './contatti.component';
import { MaterialModule } from '../../material/material.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    ContattiComponent
  ],
  imports: [
    CommonModule,
    ContattiRoutingModule,
    MaterialModule,
    HttpClientModule
  ]
})
export class ContattiModule { }
