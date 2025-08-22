// src/app/pages/portfolio/portfolio-detail/portfolio-detail.component.ts
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PortfolioService } from '../../../services/portfolio.service';
import { PortfolioItem } from '../portfolio-item.model';

declare const $localize: any;

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfolio-detail.component.html',
  styleUrls: ['./portfolio-detail.component.scss'],
})
export class PortfolioDetailComponent implements OnInit, OnDestroy {
  portfolioItem: PortfolioItem | undefined;
  isLoading = true;
  errorMessage: string | null = null;
  currentImageIndex: number = 0;
  private routeSubscription: Subscription | undefined;
  private isBrowser: boolean;

  showFullscreen: boolean = false;
  fullscreenImageIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private portfolioService: PortfolioService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadPortfolioItem(id);
      } else {
        this.errorMessage = $localize`:@@portfolioDetailIdNotFound:ID portfolio non fornito.`;
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    if (this.isBrowser && this.showFullscreen) {
      document.body.style.overflow = '';
    }
  }

  loadPortfolioItem(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.portfolioService.getPortfolioItemById(id).subscribe({
      next: (item) => {
        if (item) {
          this.portfolioItem = item;
          this.isLoading = false;
          this.currentImageIndex = 0;
        } else {
          this.errorMessage = $localize`:@@portfolioDetailItemNotFound:Elemento portfolio non trovato.`;
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.errorMessage = $localize`:@@portfolioDetailLoadError:Errore nel caricamento dell'elemento: ${err.message || 'Errore sconosciuto.'}`;
        this.isLoading = false;
        console.error('Errore caricamento dettaglio portfolio:', err);
      }
    });
  }

  prevImage(): void {
    if (!this.portfolioItem?.images?.length) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.portfolioItem.images.length) % this.portfolioItem.images.length;
  }

  nextImage(): void {
    if (!this.portfolioItem?.images?.length) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.portfolioItem.images.length;
  }

  goBack(): void {
    this.router.navigate(['/portfolio']);
  }

  openFullscreen(index: number): void {
    if (!this.isBrowser) return;
    this.fullscreenImageIndex = index;
    this.showFullscreen = true;
    document.body.style.overflow = 'hidden';
  }

  closeFullscreen(): void {
    if (!this.isBrowser) return;
    this.showFullscreen = false;
    document.body.style.overflow = '';
  }

  prevFullscreenImage(event: Event): void {
    event.stopPropagation();
    if (!this.portfolioItem?.images?.length) return;
    this.fullscreenImageIndex = (this.fullscreenImageIndex - 1 + this.portfolioItem.images.length) % this.portfolioItem.images.length;
  }

  nextFullscreenImage(event: Event): void {
    event.stopPropagation();
    if (!this.portfolioItem?.images?.length) return;
    this.fullscreenImageIndex = (this.fullscreenImageIndex + 1) % this.portfolioItem.images.length;
  }
}
