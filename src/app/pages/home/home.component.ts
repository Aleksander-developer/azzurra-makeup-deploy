// src/app/pages/home/home.component.ts

import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { trigger, transition, style, animate, group, query } from '@angular/animations';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
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
export class HomeComponent implements OnInit, OnDestroy {
  heroImages: string[] = [
    'https://res.cloudinary.com/ddqilzddj/image/upload/v1757273101/IMG_8670_ro2ycf.jpg',
    'https://res.cloudinary.com/ddqilzddj/image/upload/v1757278446/IMG_8009_jocbi8.jpg'
  ];
  currentHeroImage: string = '';
  currentIndex: number = 0;
  private carouselInterval?: Subscription;
  private isComponentAlive: boolean = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (this.heroImages.length > 0) {
      this.currentHeroImage = this.heroImages[this.currentIndex];
      if (isPlatformBrowser(this.platformId)) {
        this.startCarousel();
      }
    }
  }

  ngOnDestroy(): void {
    this.isComponentAlive = false;
    this.carouselInterval?.unsubscribe();
  }

  startCarousel(): void {
    this.stopCarousel();
    this.carouselInterval = interval(3000)
      .pipe(takeWhile(() => this.isComponentAlive))
      .subscribe(() => this.nextImage());
  }

  stopCarousel(): void {
    this.carouselInterval?.unsubscribe();
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