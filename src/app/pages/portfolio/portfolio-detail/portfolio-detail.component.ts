import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PortfolioItem } from '../portfolio-item.model';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PortfolioService } from '../../../services/portfolio.service';

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfolio-detail.component.html',
  styleUrls: ['./portfolio-detail.component.scss']
})
export class PortfolioDetailComponent implements OnInit {

  public portfolioItem$!: Observable<PortfolioItem>;

  constructor(
    private route: ActivatedRoute,
    private portfolioService: PortfolioService
  ) { }

  ngOnInit(): void {
    // Recuperiamo l'ID dalla rotta e usiamo switchMap per chiamare il servizio
    this.portfolioItem$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          // Gestisci caso in cui l'ID non è presente, magari reindirizzando
          throw new Error('ID non trovato');
        }
        return this.portfolioService.getPortfolioItemById(id);
      })
    );
  }
}