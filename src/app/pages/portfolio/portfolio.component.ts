// src/app/pages/portfolio/portfolio.component.ts

import { Component, OnInit } from '@angular/core';
import { PortfolioItem } from './portfolio-item.model';
import { Observable } from 'rxjs';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'] // Corretto da styleUrl a styleUrls
})
export class PortfolioComponent implements OnInit {

  // Usiamo un Observable per gestire i dati in modo reattivo con la pipe async
  public portfolioItems$!: Observable<PortfolioItem[]>;

  constructor(private portfolioService: PortfolioService) { }

  ngOnInit(): void {
    this.portfolioItems$ = this.portfolioService.getPortfolioItems();
  }
}