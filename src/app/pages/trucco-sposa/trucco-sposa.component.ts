// src/app/pages/trucco-sposa/trucco-sposa.component.ts

import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { trigger, transition, style, animate, group, query } from '@angular/animations';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

// Definiamo un'interfaccia per la nostra struttura di immagini
interface Transformation {
  before: string;
  after: string;
}

@Component({
  selector: 'app-trucco-sposa',
  templateUrl: './trucco-sposa.component.html',
  styleUrls: ['./trucco-sposa.component.scss'],
  animations: [
    // Animazione di fade per il cambio immagine, la stessa della tua home
    trigger('imageFade', [
      transition(':increment, :decrement', [
        group([
          query(':enter', [
            style({ opacity: 0 }),
            animate('800ms ease-in-out', style({ opacity: 1 }))
          ], { optional: true }),
          query(':leave', [
            animate('800ms ease-in-out', style({ opacity: 0 }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class TruccoSposaComponent implements OnInit, OnDestroy {

  // --- Carosello per il Pacchetto "Seguimi" (Highlight) ---

  // Array di oggetti, ognuno con un'immagine "prima" e una "dopo"
  highlightImages: Transformation[] = [
    { before: 'https://res.cloudinary.com/ddqilzddj/image/upload/v1757267907/IMG_8469_t9hkwi.jpg', after: 'https://res.cloudinary.com/ddqilzddj/image/upload/v1757267773/IMG_0465_p2vf1o.jpg' },
    { before: 'https://res.cloudinary.com/ddqilzddj/image/upload/v1757267905/IMG_8582_cd9v0l.jpg', after: 'https://res.cloudinary.com/ddqilzddj/image/upload/v1757267906/IMG_8600_mi4emb.jpg' },
    // Aggiungi altre coppie di immagini qui
  ];
  currentHighlightIndex = 0;
  isShowingAfterHighlight = false; // Stato per mostrare "prima" o "dopo"


  // --- Carosello per il Pacchetto "Standard" ---

  standardImages: Transformation[] = [
    { before: 'https://res.cloudinary.com/ddqilzddj/image/upload/v1757267905/IMG_8582_cd9v0l.jpg', after: 'https://res.cloudinary.com/ddqilzddj/image/upload/v1757267906/IMG_8600_mi4emb.jpg' },
    // { before: 'assets/trucco-sposa/standard-2-prima.jpg', after: 'assets/trucco-sposa/standard-2-dopo.jpg' },
    // Aggiungi altre coppie di immagini qui
  ];
  currentStandardIndex = 0;
  isShowingAfterStandard = false; // Stato per mostrare "prima" o "dopo"

  // --- Logica Comune del Carosello ---
  private carouselInterval?: Subscription;
  private isComponentAlive = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    // Il carosello parte solo se siamo nel browser (per compatibilità con SSR)
    if (isPlatformBrowser(this.platformId)) {
      this.startCarousels();
    }
  }

  ngOnDestroy(): void {
    // Pulizia della sottoscrizione per evitare memory leak
    this.isComponentAlive = false;
    this.carouselInterval?.unsubscribe();
  }

  // Getter per ottenere l'URL dell'immagine corretta per il template
  get currentHighlightImage(): string {
    const currentSet = this.highlightImages[this.currentHighlightIndex];
    return this.isShowingAfterHighlight ? currentSet.after : currentSet.before;
  }

  get currentStandardImage(): string {
    const currentSet = this.standardImages[this.currentStandardIndex];
    return this.isShowingAfterStandard ? currentSet.after : currentSet.before;
  }

  startCarousels(): void {
    this.carouselInterval?.unsubscribe();
    // Ogni 4 secondi, esegue il cambio
    this.carouselInterval = interval(3000)
      .pipe(takeWhile(() => this.isComponentAlive))
      .subscribe(() => {
        this.advanceCarousels();
      });
  }

  advanceCarousels(): void {
    // Logica per il carosello HIGHLIGHT
    this.isShowingAfterHighlight = !this.isShowingAfterHighlight;
    // Se siamo tornati a "prima", passiamo alla coppia di immagini successiva
    if (!this.isShowingAfterHighlight) {
      this.currentHighlightIndex = (this.currentHighlightIndex + 1) % this.highlightImages.length;
    }

    // Logica per il carosello STANDARD
    this.isShowingAfterStandard = !this.isShowingAfterStandard;
    // Se siamo tornati a "prima", passiamo alla coppia di immagini successiva
    if (!this.isShowingAfterStandard) {
      this.currentStandardIndex = (this.currentStandardIndex + 1) % this.standardImages.length;
    }
  }

  // Metodo per generare un valore univoco per il trigger dell'animazione.
  // Questo assicura che l'animazione scatti ogni volta che cambia l'immagine ("prima" -> "dopo" o cambio coppia).
  getHighlightAnimationTrigger(): number {
    return this.currentHighlightIndex + (this.isShowingAfterHighlight ? 0.5 : 0);
  }

  getStandardAnimationTrigger(): number {
    return this.currentStandardIndex + (this.isShowingAfterStandard ? 0.5 : 0);
  }
}