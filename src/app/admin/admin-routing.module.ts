import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { AlbumFormComponent } from './album-form/album-form.component';

const routes: Routes = [
  {
    path: 'album-form',
    component: AlbumFormComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: 'album-form', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
