// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule, Meta, provideClientHydration, Title } from '@angular/platform-browser';

// <-- 1. IMPORTA HttpClientModule e HTTP_INTERCEPTORS
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './material/material.module';
import { AuthService } from './services/auth.service';

// <-- 2. IMPORTA LA CLASSE del tuo interceptor
import { ApiKeyInterceptor } from './interceptors/api-key.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule,
    HttpClientModule // <-- 3. AGGIUNGI HttpClientModule qui
  ],
  providers: [
    AuthService,
    // provideHttpClient(withFetch()), // <-- 4. RIMUOVI questa riga
    provideClientHydration(),
    provideAnimationsAsync(),
    Title,
    Meta,
    // <-- 5. AGGIUNGI questo provider per attivare l'interceptor
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: ApiKeyInterceptor, 
      multi: true 
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }