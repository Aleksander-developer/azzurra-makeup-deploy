// src/app/admin/portfolio-management.component.ts

import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PortfolioItem, PortfolioImage } from '../../pages/portfolio/portfolio-item.model';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-portfolio-management',
  templateUrl: './portfolio-management.component.html',
  styleUrls: ['./portfolio-management.component.scss']
})
export class PortfolioManagementComponent implements OnInit {
  // Stati per la UI
  isLoading = true;
  isFormVisible = false;
  isEditing = false;
  
  // Dati
  portfolioItems: PortfolioItem[] = [];
  selectedItemId: string | null = null;
  
  // Form reattivo
  portfolioForm: FormGroup;
  public categories: string[] = ['Trucco Sposa', 'Eventi', 'Shooting Fotografico', 'Lezione'];

  // Gestione delle immagini
  newImageFiles: File[] = [];
  existingImages: PortfolioImage[] = [];

  // Gestione galleria fullscreenn
  isGalleryVisible = false;
  currentImageIndex = 0;

  constructor(
    private portfolioService: PortfolioService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
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

  // --- Gestione del Form ---
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
    this.portfolioForm.patchValue(item);
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

  // --- Gestione Immagini ---
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
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

  // --- Azioni CRUD ---
  onSubmit(): void {
    if (this.portfolioForm.invalid) return;
    const formData = new FormData();
    Object.keys(this.portfolioForm.controls).forEach(key => {
        formData.append(key, this.portfolioForm.get(key)?.value || '');
    });
    const imagesMetadata = [
      ...this.existingImages,
      ...this.newImageFiles.map(() => ({ isNew: true }))
    ];
    formData.append('imagesMetadata', JSON.stringify(imagesMetadata));
    this.newImageFiles.forEach(file => formData.append('images', file, file.name));
    
    const action = this.isEditing && this.selectedItemId
      ? this.portfolioService.updatePortfolioItem(this.selectedItemId, formData)
      : this.portfolioService.addPortfolioItem(formData);
      
    action.subscribe({
      next: () => {
        this.showNotification(`Album ${this.isEditing ? 'aggiornato' : 'creato'} con successo!`, 'success');
        this.loadItems();
        this.closeForm();
      },
      error: (err) => {
        console.error('Errore nel salvataggio', err);
        this.showNotification('Errore durante il salvataggio.', 'error');
      }
    });
  }

  deleteItem(id: string | undefined): void {
    if (!id) return;
    if (confirm('Sei sicuro di voler eliminare questo album? L\'azione è irreversibile.')) {
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

  // --- Galleria Fullscreen ---
  openGallery(index: number): void {
    this.currentImageIndex = index;
    this.isGalleryVisible = true;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeGallery(): void {
    this.isGalleryVisible = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
    }
  }

  navigateGallery(direction: 'next' | 'prev', event: Event): void {
    event.stopPropagation();
    const totalImages = this.existingImages.length;
    if (direction === 'next' && this.currentImageIndex < totalImages - 1) {
      this.currentImageIndex++;
    } else if (direction === 'prev' && this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  // --- Notifiche ---
  private showNotification(message: string, panelClass: 'success' | 'error'): void {
    this.snackBar.open(message, 'Chiudi', {
      duration: 3000,
      panelClass: [panelClass]
    });
  }
}
