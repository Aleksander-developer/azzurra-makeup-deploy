// src/app/shared/componentns/reviews/reviews.component.ts

import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Review, ReviewsService } from '../../../services/reviews.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit, OnDestroy {
  reviews: Review[] = [];
  isLoading: boolean = true;
  currentIndex: number = 0;
  private autoSlideSubscription?: Subscription;
  private isComponentAlive = true;

  constructor(
    private reviewsService: ReviewsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.loadReviews();
  }

  ngOnDestroy(): void {
    this.isComponentAlive = false;
    this.autoSlideSubscription?.unsubscribe();
  }

  loadReviews(): void {
    this.isLoading = true;
    this.reviewsService.getReviews().subscribe(data => {
      this.reviews = data
        .filter(review => review.comment && (review.starRatingNumber >= 4))
        .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
      
      this.isLoading = false;
      
      if (this.reviews.length > 1 && isPlatformBrowser(this.platformId)) {
        this.startAutoSlide();
      }
    });
  }

  startAutoSlide(): void {
    this.stopAutoSlide();
    this.autoSlideSubscription = interval(5000)
      .pipe(takeWhile(() => this.isComponentAlive))
      .subscribe(() => this.nextReview());
  }

  stopAutoSlide(): void {
    this.autoSlideSubscription?.unsubscribe();
  }

  nextReview(): void {
    if (this.reviews.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.reviews.length;
    this.resetAutoSlide();
  }

  prevReview(): void {
    if (this.reviews.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.reviews.length) % this.reviews.length;
    this.resetAutoSlide();
  }

  goToReview(index: number): void {
    if (this.reviews.length === 0) return;
    this.currentIndex = index;
    this.resetAutoSlide();
  }

  resetAutoSlide(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoSlide();
    }
  }

  getStars(rating: number): boolean[] {
    return Array(rating).fill(true);
  }

  getEmptyStars(rating: number): boolean[] {
    return Array(5 - rating).fill(false);
  }
}
