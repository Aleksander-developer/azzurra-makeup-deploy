// src/app/pages/portfolio/portfolio.component.ts
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';
import { PortfolioItem } from './portfolio-item.model';
import { PortfolioService } from '../../services/portfolio.service';

declare const $localize: any;

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  animations: [
    // ... le tue animazioni rimangono invariate
  ]
})
export class PortfolioComponent implements OnInit, OnDestroy {
  portfolioItems: PortfolioItem[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  private portfolioSubscription: Subscription | undefined;

  constructor(
    private portfolioService: PortfolioService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Rimuoviamo il controllo isPlatformBrowser da qui
    this.loadPortfolioItems();
  }

  ngOnDestroy(): void {
    this.portfolioSubscription?.unsubscribe();
  }

  loadPortfolioItems(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.portfolioSubscription = this.portfolioService.getPortfolioItems().subscribe({
      next: (items: PortfolioItem[]) => {
        this.portfolioItems = items.map(item => ({
          ...item,
          coverImageUrl: this.getPrecalculatedCoverImage(item)
        }));
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = $localize`:@@portfolioLoadError:Errore nel caricamento degli elementi del portfolio: ${err.message || 'Errore sconosciuto.'}`;
        this.isLoading = false;
        console.error('Errore nel caricamento del portfolio:', err);
      }
    });
  }

  private getPrecalculatedCoverImage(item: PortfolioItem): string {
    if (item.images && item.images.length > 0) {
      const randomIndex = Math.floor(Math.random() * item.images.length);
      return item.images[randomIndex].src || 'assets/placeholder.jpg';
    }
    return 'assets/placeholder.jpg';
  }
}