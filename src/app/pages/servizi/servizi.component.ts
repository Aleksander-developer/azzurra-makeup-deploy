// src/app/pages/servizi/servizi.component.ts
import { Component } from '@angular/core';

// Interfaccia semplificata: senza immagine
interface ServiceItem {
  id: string;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  buttonAriaKey: string;
}

@Component({
  selector: 'app-servizi',
  templateUrl: './servizi.component.html',
  styleUrls: ['./servizi.component.scss']
})
export class ServiziComponent {

  services: ServiceItem[] = [
    {
      id: 'ceremony',
      titleKey: 'Trucco Cerimonia',
      subtitleKey: 'Eleganza per ogni evento',
      descriptionKey: '',
      buttonAriaKey: 'Richiedi informazioni sul trucco cerimonia'
    },
    {
      id: 'events',
      titleKey: 'Eventi e Shooting',
      subtitleKey: 'Un look professionale per la telecamera',
      descriptionKey: '',
      buttonAriaKey: 'Richiedi informazioni su trucco per eventi e shooting'
    }
  ];

  constructor() { }
}

