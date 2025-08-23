import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioItem } from '../../pages/portfolio/portfolio-item.model';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-portfolio-management',
  templateUrl: './portfolio-management.component.html',
  styleUrls: ['./portfolio-management.component.scss']
})
export class PortfolioManagementComponent implements OnInit {

  public portfolioItems$!: Observable<PortfolioItem[]>;

  constructor(private portfolioService: PortfolioService) { }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.portfolioItems$ = this.portfolioService.getPortfolioItems();
  }

  deleteItem(id: string | undefined): void {
    if (!id) {
      console.error('ID is missing, cannot delete.');
      return;
    }

    const confirmation = confirm('Sei sicuro di voler eliminare questo elemento? L\'azione è irreversibile.');
    
    if (confirmation) {
      this.portfolioService.deletePortfolioItem(id).subscribe({
        next: () => {
          console.log('Elemento eliminato con successo!');
          this.loadItems(); // Reload the list after deletion
        },
        error: (err) => {
          console.error('Errore durante l\'eliminazione', err);
          alert('Si è verificato un errore durante l\'eliminazione.');
        }
      });
    }
  }
}