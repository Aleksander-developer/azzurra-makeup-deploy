import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { WhyChooseMeComponent } from '../components/why-choose-me/why-choose-me.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';



@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    WhyChooseMeComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    // Aggiungi qui i componenti che vuoi rendere utilizzabili all'esterno
    NavbarComponent,
    FooterComponent,
    WhyChooseMeComponent,
    MaterialModule,
    ConfirmationDialogComponent
  ]
})
export class SharedModule { }
