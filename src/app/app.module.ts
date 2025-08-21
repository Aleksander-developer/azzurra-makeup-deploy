// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule, Meta, provideClientHydration, Title } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // <-- Questo è corretto

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './material/material.module';
import { AuthService } from './services/auth.service';
import { ApiKeyInterceptor } from './interceptors/api-key.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, // <-- CORRETTO
    SharedModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    provideClientHydration(),
    // provideAnimationsAsync(), // <-- RIMOSSO: Questa riga era la causa dell'errore
    Title,
    Meta,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiKeyInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }