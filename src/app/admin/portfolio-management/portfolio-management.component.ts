import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog'; // <-- 1. Importa MatDialog
import { MatSnackBar } from '@angular/material/snack-bar'; // <-- 2. Importa MatSnackBar
import { PortfolioItem, PortfolioImage } from '../../pages/portfolio/portfolio-item.model';
import { PortfolioService } from '../../services/portfolio.service';
// Potremmo creare un componente dialog personalizzato, ma per ora usiamo quello di default se disponibile
// o semplicemente un confirm/alert più gradevole. Per una soluzione completa, vedi sotto.

@Component({
  selector: 'app-portfolio-management',
  templateUrl: './portfolio-management.component.html',
  styleUrls: ['./portfolio-management.component.scss']
})
export class PortfolioManagementComponent implements OnInit {
  // ... (proprietà esistenti: isLoading, isFormVisible, etc.)
  isLoading = true;
  isFormVisible = false;
  isEditing = false;
  portfolioItems: PortfolioItem[] = [];
  selectedItemId: string | null = null;
  portfolioForm: FormGroup;
  newImageFiles: File[] = [];
  existingImages: PortfolioImage[] = [];

  // NUOVO: Definiamo le categorie disponibili
  public categories: string[] = ['Trucco Sposa', 'Eventi', 'Shooting Fotografico', 'Lezione'];

  constructor(
    private portfolioService: PortfolioService,
    private fb: FormBuilder,
    private dialog: MatDialog, // <-- 3. Inietta MatDialog
    private snackBar: MatSnackBar // <-- 4. Inietta MatSnackBar
  ) {
    this.portfolioForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      subtitle: [''],
      category: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadItems();
  }
  
  // La funzione loadItems rimane invariata
  loadItems(): void {
    this.isLoading = true;
    this.portfolioService.getPortfolioItems().subscribe({
      next: (items) => {
        this.portfolioItems = items;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento degli album', err);
        this.isLoading = false;
        this.showNotification('Errore nel caricamento dei dati.', 'error');
      }
    });
  }

  // Le funzioni di gestione del form (open, close, etc.) rimangono invariate
  openCreateForm(): void {
    this.isEditing = false;
    this.isFormVisible = true;
    this.selectedItemId = null;
    this.portfolioForm.reset();
    this.clearImageData();
  }

  openEditForm(item: PortfolioItem): void {
    this.isEditing = true;
    this.isFormVisible = true;
    this.selectedItemId = item._id || null;
    this.portfolioForm.patchValue({
      title: item.title,
      subtitle: item.subtitle,
      category: item.category,
      description: item.description
    });
    this.existingImages = [...item.images];
    this.newImageFiles = [];
  }

  closeForm(): void {
    this.isFormVisible = false;
    this.portfolioForm.reset();
    this.clearImageData();
  }

  private clearImageData(): void {
    this.newImageFiles = [];
    this.existingImages = [];
    const inputFile = document.getElementById('image-upload') as HTMLInputElement;
    if (inputFile) inputFile.value = '';
  }

  // La gestione delle immagini (onFileSelected, remove, etc.) rimane invariata
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) {
      return;
    }
    const files = Array.from(input.files);
    if (files.length > 5) {
      this.showNotification('Puoi selezionare un massimo di 5 foto alla volta.', 'error');
      input.value = '';
      return;
    }
    const totalImages = this.existingImages.length + this.newImageFiles.length + files.length;
    if (totalImages > 10) {
      this.showNotification(`Puoi caricare al massimo 10 foto per album.`, 'error');
      input.value = '';
      return;
    }
    this.newImageFiles.push(...files);
    input.value = '';
  }

  removeExistingImage(index: number): void {
    this.existingImages.splice(index, 1);
  }

  removeNewImage(index: number): void {
    this.newImageFiles.splice(index, 1);
  }
  
  // La funzione onSubmit rimane invariata
  onSubmit(): void {
    if (this.portfolioForm.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append('title', this.portfolioForm.value.title);
    formData.append('subtitle', this.portfolioForm.value.subtitle || '');
    formData.append('category', this.portfolioForm.value.category);
    formData.append('description', this.portfolioForm.value.description || '');
    const imagesMetadata = [
      ...this.existingImages,
      ...this.newImageFiles.map(file => ({ description: '', alt: '', isNew: true }))
    ];
    formData.append('imagesMetadata', JSON.stringify(imagesMetadata));
    this.newImageFiles.forEach(file => {
      formData.append('images', file, file.name);
    });
    if (this.isEditing && this.selectedItemId) {
      this.updateItem(this.selectedItemId, formData);
    } else {
      this.createItem(formData);
    }
  }

  // AGGIORNATA: createItem ora usa la snackbar
  private createItem(formData: FormData): void {
    this.portfolioService.addPortfolioItem(formData).subscribe({
      next: () => {
        this.showNotification('Album creato con successo!', 'success');
        this.loadItems();
        this.closeForm();
      },
      error: (err) => {
        console.error('Errore nella creazione', err);
        this.showNotification('Errore durante la creazione.', 'error');
      }
    });
  }

  // AGGIORNATA: updateItem ora usa la snackbar
  private updateItem(id: string, formData: FormData): void {
    this.portfolioService.updatePortfolioItem(id, formData).subscribe({
      next: () => {
        this.showNotification('Album aggiornato con successo!', 'success');
        this.loadItems();
        this.closeForm();
      },
      error: (err) => {
        console.error('Errore nell\'aggiornamento', err);
        this.showNotification('Errore durante l\'aggiornamento.', 'error');
      }
    });
  }

  // AGGIORNATA: deleteItem ora usa MatDialog (tramite confirm()) e la snackbar
  deleteItem(id: string | undefined): void {
    if (!id) return;

    // Per semplicità, possiamo ancora usare confirm, ma un dialog personalizzato è meglio.
    // Se hai un componente ConfirmationDialog, usalo così:
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   data: { message: 'Sei sicuro di voler eliminare questo album? L\'azione è irreversibile.' }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) { /* ... logica di eliminazione ... */ }
    // });
    
    // Per ora, manteniamo `confirm` ma usiamo la snackbar per il feedback.
    const confirmation = confirm('Sei sicuro di voler eliminare questo album? L\'azione è irreversibile.');

    if (confirmation) {
      this.portfolioService.deletePortfolioItem(id).subscribe({
        next: () => {
          this.showNotification('Album eliminato con successo!', 'success');
          this.portfolioItems = this.portfolioItems.filter(item => item._id !== id);
        },
        error: (err) => {
          console.error('Errore durante l\'eliminazione', err);
          this.showNotification('Errore durante l\'eliminazione.', 'error');
        }
      });
    }
  }

  // NUOVO: Funzione helper per mostrare le notifiche
  private showNotification(message: string, panelClass: 'success' | 'error'): void {
    this.snackBar.open(message, 'Chiudi', {
      duration: 3000,
      panelClass: [panelClass] // Applica una classe CSS per lo stile
    });
  }
}