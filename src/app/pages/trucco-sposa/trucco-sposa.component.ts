// src/app/pages/trucco-sposa/trucco-sposa.component.ts

import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { trigger, transition, style, animate, group, query } from '@angular/animations';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

interface Transformation {
  before: string;
  after: string;
}

@Component({
  selector: 'app-trucco-sposa',
  templateUrl: './trucco-sposa.component.html',
  styleUrls: ['./trucco-sposa.component.scss'],
  animations: [
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

  // === Carosello HIGHLIGHT (All Inclusive) ===
  highlightImages: Transformation[] = [
    { before: 'https://res.cloudinary.com/ddqilzddj/image/upload/v1757267907/IMG_8469_t9hkwi.jpg', after: 'https://res.cloudinary.com/ddqilzddj/image/upload/v1757267773/IMG_0465_p2vf1o.jpg' },
    // { before: 'https://res.cloudinary.com/ddqilzddj/image/upload/v1757267905/IMG_8582_cd9v0l.jpg', after: 'https://res.cloudinary.com/ddqilzddj/image/upload/v1757267906/IMG_8600_mi4emb.jpg' },
  ];
  currentHighlightIndex = 0;
  isShowingAfterHighlight = false;

  // === Carosello GOLD ===
  goldImages: Transformation[] = [
    // Puoi sostituire/aggiungere immagini a piacere
    { before: 'https://res.cloudinary.com/ddqilzddj/image/upload/v1757267905/IMG_8582_cd9v0l.jpg', after: 'https://res.cloudinary.com/ddqilzddj/image/upload/v1757267906/IMG_8600_mi4emb.jpg' },
  ];
  currentGoldIndex = 0;
  isShowingAfterGold = false;

  // === Carosello HAIR & MAKEUP ===
  hairMakeupImages: Transformation[] = [
    // Puoi sostituire/aggiungere immagini a piacere
    { before: 'https://res.cloudinary.com/ddqilzddj/image/upload/v1757267907/IMG_8469_t9hkwi.jpg', after: 'https://res.cloudinary.com/ddqilzddj/image/upload/v1757267773/IMG_0465_p2vf1o.jpg' },
  ];
  currentHairMakeupIndex = 0;
  isShowingAfterHairMakeup = false;

  // --- Timer ---
  private carouselInterval?: Subscription;
  private isComponentAlive = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startCarousels();
    }
  }

  ngOnDestroy(): void {
    this.isComponentAlive = false;
    this.carouselInterval?.unsubscribe();
  }

  // === Getter immagini correnti ===
  get currentHighlightImage(): string {
    const currentSet = this.highlightImages[this.currentHighlightIndex];
    return this.isShowingAfterHighlight ? currentSet.after : currentSet.before;
  }

  get currentGoldImage(): string {
    const currentSet = this.goldImages[this.currentGoldIndex];
    return this.isShowingAfterGold ? currentSet.after : currentSet.before;
  }

  get currentHairMakeupImage(): string {
    const currentSet = this.hairMakeupImages[this.currentHairMakeupIndex];
    return this.isShowingAfterHairMakeup ? currentSet.after : currentSet.before;
  }

  // === Animazioni: trigger univoci ===
  getHighlightAnimationTrigger(): number {
    return this.currentHighlightIndex + (this.isShowingAfterHighlight ? 0.5 : 0);
  }

  getGoldAnimationTrigger(): number {
    return this.currentGoldIndex + (this.isShowingAfterGold ? 0.5 : 0);
  }

  getHairMakeupAnimationTrigger(): number {
    return this.currentHairMakeupIndex + (this.isShowingAfterHairMakeup ? 0.5 : 0);
  }

  // === Avvio caroselli ===
  startCarousels(): void {
    this.carouselInterval?.unsubscribe();
    this.carouselInterval = interval(3000)
      .pipe(takeWhile(() => this.isComponentAlive))
      .subscribe(() => this.advanceCarousels());
  }

  // === Avanzamento sincronizzato di tutti i caroselli ===
  advanceCarousels(): void {
    // Highlight
    this.isShowingAfterHighlight = !this.isShowingAfterHighlight;
    if (!this.isShowingAfterHighlight) {
      this.currentHighlightIndex = (this.currentHighlightIndex + 1) % this.highlightImages.length;
    }

    // Gold
    this.isShowingAfterGold = !this.isShowingAfterGold;
    if (!this.isShowingAfterGold) {
      this.currentGoldIndex = (this.currentGoldIndex + 1) % this.goldImages.length;
    }

    // Hair & Makeup
    this.isShowingAfterHairMakeup = !this.isShowingAfterHairMakeup;
    if (!this.isShowingAfterHairMakeup) {
      this.currentHairMakeupIndex = (this.currentHairMakeupIndex + 1) % this.hairMakeupImages.length;
    }
  }
}

