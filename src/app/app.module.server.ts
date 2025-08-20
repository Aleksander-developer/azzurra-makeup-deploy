import { NgModule, NgZone } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ɵNoopNgZone } from '@angular/core'; // Importa NoopNgZone

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  providers: [
    // Aggiungendo questo provider, risolvi l'errore NG0908
    { provide: NgZone, useClass: ɵNoopNgZone }
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
