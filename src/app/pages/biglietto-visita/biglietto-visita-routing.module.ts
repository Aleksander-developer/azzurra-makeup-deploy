import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BigliettoVisitaComponent } from './biglietto-visita.component';

const routes: Routes = [
  { path: '', component: BigliettoVisitaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BigliettoVisitaRoutingModule { }
