import { NgModule } from '@angular/core';
import { BrowserModule, Meta, provideClientHydration, Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './material/material.module';
import { AuthService } from './services/auth.service';
import { provideHttpClient, withFetch } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule
  ],
  providers: [
    AuthService,
    provideHttpClient(withFetch()),
    provideClientHydration(),
    provideAnimationsAsync(),
    Title,
    Meta
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
