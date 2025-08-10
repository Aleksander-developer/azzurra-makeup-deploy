import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
// Il percorso di import è più semplice ora

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [

      // Reindirizzamento di default
      { path: '', redirectTo: 'portfolio-manager', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }