import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PortfolioItem } from '../portfolio-item.model';
import { PortfolioService } from '../../../services/portfolio.service'; // Assicurati che il percorso sia corretto

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfolio-detail.component.html',
  styleUrls: ['./portfolio-detail.component.scss']
})
export class PortfolioDetailComponent implements OnInit {

  // Creiamo un Observable che conterrà i dati del singolo album
  public portfolioItem$!: Observable<PortfolioItem>;

  constructor(
    private route: ActivatedRoute, // ActivatedRoute ci permette di leggere i parametri dall'URL
    private portfolioService: PortfolioService // Il nostro servizio per recuperare i dati
  ) { }

  ngOnInit(): void {
    // Usiamo un approccio reattivo per recuperare i dati
    this.portfolioItem$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id'); // Estrae l'ID dall'URL (es. '123')
        if (!id) {
          // Se per qualche motivo l'ID non c'è, gestiamo il caso
          // Potremmo reindirizzare o mostrare un errore
          throw new Error('ID dell\'album non trovato nell\'URL.');
        }
        // Usiamo l'ID per chiamare il servizio e recuperare i dati dell'album
        return this.portfolioService.getPortfolioItemById(id);
      })
    );
  }
}