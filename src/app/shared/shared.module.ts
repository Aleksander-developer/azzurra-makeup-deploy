// src/app/shared/shared.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Importa solo i TUOI componenti condivisi
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { WhyChooseMeComponent } from '../components/why-choose-me/why-choose-me.component';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';

// Importa il tuo modulo che gestisce tutto Angular Material
import { MaterialModule } from '../material/material.module';
import { ReviewsComponent } from './components/reviews/reviews.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    WhyChooseMeComponent,
    ConfirmationDialogComponent,
    ReviewsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule // Importa MaterialModule qui
  ],
  exports: [
    // Esporta i TUOI componenti che vuoi usare nel resto dell'app
    NavbarComponent,
    FooterComponent,
    WhyChooseMeComponent,
    ConfirmationDialogComponent,
    ReviewsComponent,

    // Esporta MaterialModule così gli altri moduli non devono importarlo di nuovo
    MaterialModule
  ]
})
export class SharedModule { }