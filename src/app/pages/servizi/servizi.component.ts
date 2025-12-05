
// src/app/pages/servizi/servizi.component.ts
import { Component } from '@angular/core';

// Interfaccia con immagine aggiunta
interface ServiceItem {
  id: string;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  imageUrl: string;        // <--- nuovo
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
      imageUrl: 'https://res.cloudinary.com/ddqilzddj/image/upload/v1762702357/IMG_0069_yxlzc4.jpg',
      buttonAriaKey: 'Richiedi informazioni sul trucco cerimonia'
    },
    {
      id: 'events',
      titleKey: 'Eventi e Shooting',
      subtitleKey: 'Un look professionale per la telecamera',
      descriptionKey: '',
      imageUrl: 'https://res.cloudinary.com/ddqilzddj/image/upload/v1762702356/IMG_9509_rvxifx.jpg',
      buttonAriaKey: 'Richiedi informazioni su trucco per eventi e shooting'
    }
  ];

  constructor() { }
}

