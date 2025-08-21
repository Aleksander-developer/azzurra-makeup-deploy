import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PortfolioImage, PortfolioItem } from '../pages/portfolio/portfolio-item.model';
import { PortfolioService } from '../services/portfolio.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';
import { ConfirmationDialogComponent } from '../shared/dialogs/confirmation-dialog/confirmation-dialog.component';

// Importa $localize
declare const $localize: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  portfolioForm!: FormGroup;
  portfolioItems: PortfolioItem[] = [];
  editingItem: PortfolioItem | null = null;

  allImagePreviews: (string | ArrayBuffer | null)[] = [];

  loading = false;
  isUploading = false;

  errorMessage: string | null = null;
  successMessage: string | null = null;

  displayedColumns: string[] = ['title', 'category', 'actions'];

  @ViewChild('galleryFileInput') galleryFileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadPortfolioItems();
  }

  ngOnDestroy(): void {
    // Non sono necessarie sottoscrizioni manuali qui
  }

  initForm(): void {
    this.portfolioForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: [''],
      description: [''],
      category: ['', Validators.required],
      images: this.fb.array([])
    });
  }

  get imagesFormArray(): FormArray {
    return this.portfolioForm.get('images') as FormArray;
  }
  
  createImageGroup(image?: PortfolioImage, file?: File): FormGroup {
    const uniqueId = image?.src || Math.random().toString(36).substring(2, 15);
    return this.fb.group({
      id: [uniqueId],
      src: [image ? image.src : undefined],
      description: [image ? image.description : ''],
      alt: [image ? image.alt : ''],
      isNew: [!image],
      file: [file]
    });
  }

  get formTitle(): string {
    return this.editingItem
      ? $localize`:@@adminPortfolioManagerFormEditTitle:Modifica Lavoro`
      : $localize`:@@adminPortfolioManagerFormAddTitle:Aggiungi Nuovo Lavoro`;
  }

  get submitButtonLabel(): string {
    return this.editingItem
      ? $localize`:@@adminPortfolioManagerSaveChangesButton:Salva Modifiche`
      : $localize`:@@adminPortfolioManagerAddWorkButton:Aggiungi Lavoro`;
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    files.forEach(file => {
      if (this.imagesFormArray.length < 10) {
        const newImageGroup = this.createImageGroup(undefined, file);
        this.imagesFormArray.push(newImageGroup);
        const reader = new FileReader();
        reader.onload = () => {
          // <-- CORREZIONE 1: Aggiungi un controllo per assicurarsi che reader.result non sia null
          this.allImagePreviews.push(reader.result || null);
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
      }
    });

    if (this.imagesFormArray.length >= 10 && isPlatformBrowser(this.platformId)) {
      this.snackBar.open($localize`:@@adminPortfolioManagerMaxImagesWarning:Massimo 10 immagini consentite per portfolio.`, $localize`:@@commonCloseButton:Chiudi`, { duration: 3000 });
    }
    input.value = '';
  }

  removeImage(index: number): void {
    this.imagesFormArray.removeAt(index);
    this.allImagePreviews.splice(index, 1);
  }

  loadPortfolioItems(): void {
    if (isPlatformBrowser(this.platformId)) {
        this.loading = true;
        this.errorMessage = null;
        this.portfolioService.getPortfolioItems().subscribe({
        next: (items) => {
            this.portfolioItems = items;
            this.loading = false;
        },
        error: (err) => {
            this.errorMessage = $localize`:@@adminPortfolioManagerLoadErrorMessage:Errore nel caricamento: ${err.message || 'Errore sconosciuto.'}`;
            this.snackBar.open($localize`:@@adminPortfolioManagerLoadError:Errore nel caricamento degli elementi del portfolio.`, $localize`:@@commonCloseButton:Chiudi`, { duration: 3000 });
            this.loading = false;
        }
        });
    }
  }

  editItem(item: PortfolioItem): void {
    this.editingItem = item;
    this.portfolioForm.patchValue(item);
    this.imagesFormArray.clear();
    this.allImagePreviews = [];
    item.images?.forEach(img => {
      this.imagesFormArray.push(this.createImageGroup(img));
      // <-- CORREZIONE 2: Usa '|| null' per gestire il caso in cui img.src sia undefined
      this.allImagePreviews.push(img.src || null);
    });
  }

  clearForm(): void {
    this.portfolioForm.reset();
    this.editingItem = null;
    this.imagesFormArray.clear();
    this.allImagePreviews = [];
    if (this.galleryFileInput && isPlatformBrowser(this.platformId)) {
      this.galleryFileInput.nativeElement.value = '';
    }
  }

  async onSubmit(): Promise<void> {
    if (this.portfolioForm.invalid) {
      if (isPlatformBrowser(this.platformId)) {
        this.snackBar.open($localize`:@@adminPortfolioManagerFormInvalid:Per favore, compila tutti i campi obbligatori.`, $localize`:@@commonCloseButton:Chiudi`, { duration: 3000 });
      }
      return;
    }

    this.loading = true;
    this.isUploading = true;
    
    const formData = new FormData();
    
    formData.append('title', this.portfolioForm.get('title')?.value);
    formData.append('subtitle', this.portfolioForm.get('subtitle')?.value || '');
    formData.append('description', this.portfolioForm.get('description')?.value || '');
    formData.append('category', this.portfolioForm.get('category')?.value);

    const imagesMetadata = this.imagesFormArray.value.map((img: any) => ({
        src: img.src,
        description: img.description,
        alt: img.alt,
        isNew: img.isNew
    }));
    formData.append('images', JSON.stringify(imagesMetadata));

    this.imagesFormArray.controls.forEach(control => {
      if (control.value.isNew && control.value.file) {
        formData.append('galleryImages', control.value.file);
      }
    });
    
    try {
      if (this.editingItem) {
        await this.portfolioService.updatePortfolioItem(this.editingItem.id!, formData).toPromise();
        if (isPlatformBrowser(this.platformId)) {
          this.snackBar.open($localize`:@@adminPortfolioManagerUpdateSuccess:Elemento portfolio aggiornato con successo!`, $localize`:@@commonCloseButton:Chiudi`, { duration: 3000 });
        }
      } else {
        await this.portfolioService.addPortfolioItem(formData).toPromise();
        if (isPlatformBrowser(this.platformId)) {
          this.snackBar.open($localize`:@@adminPortfolioManagerAddSuccess:Elemento portfolio aggiunto con successo!`, $localize`:@@commonCloseButton:Chiudi`, { duration: 3000 });
        }
      }
      this.clearForm();
      this.loadPortfolioItems();
    } catch (error: any) {
      if (isPlatformBrowser(this.platformId)) {
        this.snackBar.open($localize`:@@adminPortfolioManagerOperationError:Errore durante l'operazione: ${error.message || 'Errore sconosciuto.'}`, $localize`:@@commonCloseButton:Chiudi`, { duration: 5000 });
      }
    } finally {
      this.loading = false;
      this.isUploading = false;
    }
  }

  deleteItem(id: string): void {
    if (!id || !isPlatformBrowser(this.platformId)) return;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: $localize`:@@adminPortfolioManagerDeleteConfirm:Sei sicuro di voler eliminare questo elemento del portfolio?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.portfolioService.deletePortfolioItem(id).subscribe({
          next: () => {
            this.snackBar.open($localize`:@@adminPortfolioManagerDeleteSuccess:Elemento portfolio eliminato con successo!`, $localize`:@@commonCloseButton:Chiudi`, { duration: 3000 });
            this.loadPortfolioItems();
          },
          error: (err) => {
            this.snackBar.open($localize`:@@adminPortfolioManagerDeleteError:Errore durante l'eliminazione: ${err.message || 'Errore sconosciuto.'}`, $localize`:@@commonCloseButton:Chiudi`, { duration: 5000 });
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          }
        });
      }
    });
  }

  trackByFn(index: number, item: AbstractControl): any {
    return item.get('id')?.value || index;
  }
}