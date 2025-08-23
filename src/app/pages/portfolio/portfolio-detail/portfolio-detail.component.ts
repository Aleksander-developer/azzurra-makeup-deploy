// src/app/pages/portfolio/portfolio-detail.component.ts

import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PortfolioItem } from '../portfolio-item.model';
import { PortfolioService } from '../../../services/portfolio.service';

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfolio-detail.component.html',
  styleUrls: ['./portfolio-detail.component.scss']
})
export class PortfolioDetailComponent implements OnInit {

  public portfolioItem$!: Observable<PortfolioItem>;

  // NUOVO: Proprietà per la galleria fullscreen
  isGalleryVisible = false;
  currentImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private portfolioService: PortfolioService,
    @Inject(PLATFORM_ID) private platformId: Object // Inietta PLATFORM_ID per la gestione del body
  ) { }

  ngOnInit(): void {
    this.portfolioItem$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          throw new Error('ID dell\'album non trovato nell\'URL.');
        }
        return this.portfolioService.getPortfolioItemById(id);
      })
    );
  }

  // NUOVO: Metodi per gestire la galleria fullscreen
  openGallery(index: number): void {
    this.currentImageIndex = index;
    this.isGalleryVisible = true;
    // Blocca lo scroll del body quando la galleria è aperta
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeGallery(): void {
    this.isGalleryVisible = false;
    // Ripristina lo scroll del body
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
    }
  }

  navigateGallery(direction: 'next' | 'prev', event: Event, lastIndex: number): void {
    event.stopPropagation(); // Evita che il click sui pulsanti chiuda la galleria
    
    if (direction === 'next' && this.currentImageIndex < lastIndex) {
      this.currentImageIndex++;
    } else if (direction === 'prev' && this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }
}