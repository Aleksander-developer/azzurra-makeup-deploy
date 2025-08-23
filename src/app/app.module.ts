// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule, Meta, provideClientHydration, Title } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // <-- Questo è corretto

// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './material/material.module';
import { AuthService } from './services/auth.service';
import { ApiKeyInterceptor } from './interceptors/api-key.interceptor';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FileToUrlPipe } from './pipes/file-to-url.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
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
    provideClientHydration(),
    AuthService,
    // provideAnimationsAsync(), // <-- RIMOSSO: Questa riga era la causa dell'errore
    Title,
    Meta,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ApiKeyInterceptor,
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }