import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { WhyChooseMeComponent } from '../components/why-choose-me/why-choose-me.component';



@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    WhyChooseMeComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    // Aggiungi qui i componenti che vuoi rendere utilizzabili all'esterno
    NavbarComponent,
    FooterComponent,
    WhyChooseMeComponent
  ]
})
export class SharedModule { }
