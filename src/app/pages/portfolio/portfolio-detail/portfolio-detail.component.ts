// src/app/portfolio/portfolio-detail/portfolio-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { AlbumApiService, Album } from '../../../services/album-api.service';

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfolio-detail.component.html',
  styleUrls: ['./portfolio-detail.component.scss']
})
export class PortfolioDetailComponent implements OnInit {
  album$!: Observable<Album>;
  isGalleryVisible = false;
  currentImageIndex = 0;

  constructor(private route: ActivatedRoute, private api: AlbumApiService) {}

  ngOnInit(): void {
    this.album$ = this.route.paramMap.pipe(
      switchMap(params => this.api.getAlbumById(params.get('id') || ''))
    );
  }

  openGallery(i: number): void {
    this.currentImageIndex = i;
    this.isGalleryVisible = true;
  }
  closeGallery(): void { this.isGalleryVisible = false; }
  navigateGallery(dir: 'prev' | 'next', evt: Event, max: number): void {
    evt.stopPropagation();
    if (dir === 'prev' && this.currentImageIndex > 0) this.currentImageIndex--;
    if (dir === 'next' && this.currentImageIndex < max) this.currentImageIndex++;
  }
}

