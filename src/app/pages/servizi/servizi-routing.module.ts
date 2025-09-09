// src/app/pages/servizi/servizi-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiziComponent } from './servizi.component';

const routes: Routes = [{ path: '', component: ServiziComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiziRoutingModule { }
