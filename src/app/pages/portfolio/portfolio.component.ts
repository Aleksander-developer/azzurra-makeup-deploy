// src/app/pages/portfolio/portfolio.component.ts

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AlbumApiService, Album } from '../../services/album-api.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  albums$!: Observable<Album[]>;

  constructor(private api: AlbumApiService) {}

  ngOnInit(): void {
    this.albums$ = this.api.getAlbums();
  }
}

