// src/app/pages/servizi/servizi.component.ts
import { Component } from '@angular/core';

// Interfaccia semplificata: ora abbiamo una sola immagine per servizio
interface ServiceItem {
  id: string;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  buttonAriaKey: string;
  image: string; // Un solo URL per l'immagine rappresentativa
  imageAltKey: string;
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
      descriptionKey: 'Che sia un battesimo, una laurea o una serata speciale, realizzo un make-up che valorizza i tuoi lineamenti e si adatta perfettamente all\'occasione.',
      buttonAriaKey: 'Richiedi informazioni sul trucco cerimonia',
      image: 'assets/trucco-cerimonia.png', // Sostituisci con la tua immagine migliore
      imageAltKey: 'Modella con trucco da cerimonia'
    },
    {
      id: 'events',
      titleKey: 'Eventi e Shooting',
      subtitleKey: 'Un look professionale per la telecamera',
      descriptionKey: 'Realizzo make-up per servizi fotografici, editoriali e video, garantendo una resa impeccabile sotto qualsiasi tipo di luce e una lunga durata.',
      buttonAriaKey: 'Richiedi informazioni su trucco per eventi e shooting',
      image: 'assets/Trucco Eventi & Servizi Fotografici.png', // Sostituisci con la tua immagine migliore
      imageAltKey: 'Modella durante uno shooting fotografico'
    }
  ];

  constructor() { }
}