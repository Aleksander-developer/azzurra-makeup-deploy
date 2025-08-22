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
            style({ opacity: 1 }),
            animate('800ms ease-in-out', style({ opacity: 0 }))
          ], { optional: true })
        ])
      ]),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-in-out', style({ opacity: 1 }))
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
  currentIndex: number = 0;
  private carouselInterval: Subscription | undefined;
  private isComponentAlive: boolean = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (this.heroImages.length > 0 && isPlatformBrowser(this.platformId)) {
      this.startCarousel();
    }
  }

  ngOnDestroy(): void {
    this.isComponentAlive = false; // Ferma il takeWhile
  }

  startCarousel(): void {
    this.carouselInterval = interval(5000)
      .pipe(takeWhile(() => this.isComponentAlive))
      .subscribe(() => {
        this.nextImage();
      });
  }

  stopCarousel(): void {
    this.carouselInterval?.unsubscribe();
  }

  prevImage(): void {
    this.stopCarousel();
    this.currentIndex = (this.currentIndex - 1 + this.heroImages.length) % this.heroImages.length;
    this.startCarousel();
  }

  nextImage(): void {
    this.stopCarousel();
    this.currentIndex = (this.currentIndex + 1) % this.heroImages.length;
    this.startCarousel();
  }

  goToImage(index: number): void {
    this.stopCarousel();
    this.currentIndex = index;
    this.startCarousel();
  }
}