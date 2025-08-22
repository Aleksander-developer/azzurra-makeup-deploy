// src/app.module.server.ts

import { NgModule, NgZone } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ɵNoopNgZone } from '@angular/core'; // Importa NoopNgZone

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    NoopAnimationsModule,
    AppRoutingModule 
  ],
  providers: [
    // // Questa riga è la soluzione all'errore NG0908.
    { provide: NgZone, 
      useClass: ɵNoopNgZone }
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}