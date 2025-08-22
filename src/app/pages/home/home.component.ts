// src/app/pages/home/home.component.ts
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

declare const $localize: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    // La definizione dell'animazione rimane la stessa
    trigger('imageFade', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0 })),
      transition('* <=> *', [
        animate('500ms ease-in-out')
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  heroImages: string[] = [
    'https://res.cloudinary.com/ddqilzddj/image/upload/v1752847726/logo_dhzlmi.png',
    'https://res.cloudinary.com/ddqilzddj/image/upload/v1752775011/azzurra-makeup/portfolio/ednmu907ominu29wgj0u.jpg',
    'https://res.cloudinary.com/ddqilzddj/image/upload/v1752944812/SnapInsta.to_468394954_18472014007046517_2476016588489560134_n_lji6e5.jpg',
  ];
  currentHeroImage: string = '';
  currentIndex: number = 0;
  private carouselInterval: Subscription | undefined;
  public isBrowser: boolean; // Ho reso la variabile pubblica per l'uso nel template
  private isComponentAlive: boolean = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.heroImages.length > 0) {
      this.currentHeroImage = this.heroImages[this.currentIndex];
      // Avvia il carosello solo se siamo nel browser
      if (this.isBrowser) {
        this.startCarousel();
      }
    }
  }

  ngOnDestroy(): void {
    this.isComponentAlive = false;
    this.stopCarousel();
  }

  startCarousel(): void {
    this.carouselInterval = interval(5000)
      .pipe(takeWhile(() => this.isComponentAlive))
      .subscribe(() => this.nextImage());
  }

  stopCarousel(): void {
    if (this.carouselInterval) {
      this.carouselInterval.unsubscribe();
      this.carouselInterval = undefined;
    }
  }

  prevImage(): void {
    this.stopCarousel();
    this.currentIndex = (this.currentIndex - 1 + this.heroImages.length) % this.heroImages.length;
    this.currentHeroImage = this.heroImages[this.currentIndex];
    this.startCarousel();
  }

  nextImage(): void {
    this.stopCarousel();
    this.currentIndex = (this.currentIndex + 1) % this.heroImages.length;
    this.currentHeroImage = this.heroImages[this.currentIndex];
    this.startCarousel();
  }

  goToImage(index: number): void {
    this.stopCarousel();
    this.currentIndex = index;
    this.currentHeroImage = this.heroImages[this.currentIndex];
    this.startCarousel();
  }
}
