// src/app/pages/portfolio/portfolio.component.ts

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AlbumApiService, Album } from '../../services/album-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  albums$!: Observable<Album[]>;

  constructor(private api: AlbumApiService, private router: Router) {}

  ngOnInit(): void {
    this.albums$ = this.api.getAlbums();
  }

  openAlbum(item: Album): void {
    if (item.id) {
      this.router.navigate(['/portfolio', item.id]);
    }
  }
}

