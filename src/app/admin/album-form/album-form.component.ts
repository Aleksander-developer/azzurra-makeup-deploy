
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { AlbumApiService, Album } from '../../services/album-api.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-album-form',
  templateUrl: './album-form.component.html',
  styleUrls: ['./album-form.component.scss']
})
export class AlbumFormComponent implements OnInit {
  form!: FormGroup;
  isBrowser = false;

  albums$!: Observable<Album[]>;
  albums: Album[] = [];

  editingId: string | null = null;
  savingOrder = false;

  constructor(
    private fb: FormBuilder,
    private api: AlbumApiService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      cover: ['', [Validators.required, Validators.pattern(/^https?:\/\//)]],
      photos: this.fb.array([
        this.fb.control('', [Validators.required, Validators.pattern(/^https?:\/\//)])
      ])
    });

    this.loadAlbums();
  }

  loadAlbums(): void {
    this.albums$ = this.api.getAlbums();
    this.albums$.subscribe(list => {
      this.albums = [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    });
  }

  get photos(): FormArray {
    return this.form.get('photos') as FormArray;
  }

  addPhoto(): void {
    this.photos.push(
      this.fb.control('', [Validators.required, Validators.pattern(/^https?:\/\//)])
    );
  }

  removePhoto(i: number): void {
    this.photos.removeAt(i);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload = {
      title: raw.title,
      description: raw.description || '',
      cover: raw.cover,
      photos: raw.photos || [],
      order: this.albums.length
    };

    if (this.editingId) {
      this.api.updateAlbum(this.editingId, payload).subscribe({
        next: () => {
          alert($localize`:@@albumUpdatedSuccessfully:Album aggiornato con successo!`);
          this.resetForm();
          this.loadAlbums();
        },
        error: () => alert('Errore durante l’aggiornamento dell’album')
      });
    } else {
      this.api.createAlbum(payload).subscribe({
        next: () => {
          alert($localize`:@@album.saved:Album salvato con successo!`);
          this.resetForm();
          this.loadAlbums();
        },
        error: () => alert('Errore durante la creazione dell’album')
      });
    }
  }

  editAlbum(album: Album): void {
    this.editingId = album.id;
    this.form.patchValue({
      title: album.title,
      description: album.description,
      cover: album.cover
    });
    this.photos.clear();
    (album.photos || []).forEach(p =>
      this.photos.push(
        this.fb.control(p, [Validators.required, Validators.pattern(/^https?:\/\//)])
      )
    );
  }

  deleteAlbum(id: string): void {
    if (!confirm($localize`:@@album.delete.confirm:Vuoi eliminare questo album?`)) return;
    this.api.deleteAlbum(id).subscribe({
      next: () => this.loadAlbums(),
      error: () => alert('Errore durante l’eliminazione dell’album')
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset();
    this.photos.clear();
    this.addPhoto();
  }

  // === Drag & Drop con chiamata PATCH /reorder corretta ===
  drop(event: CdkDragDrop<Album[]>): void {
    // 1) aggiorna array locale (feedback immediato)
    moveItemInArray(this.albums, event.previousIndex, event.currentIndex);

    // 2) prepara la lista degli ID nell’ordine aggiornato
    const newOrderIds = this.albums.map(a => a.id);

    this.savingOrder = true;

    this.api.reorderAlbums(newOrderIds).subscribe({
      next: (updated) => {
        this.savingOrder = false;
        // riallinea con il backend (già ordinato)
        this.albums = [...updated].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      },
      error: (err) => {
        console.error('Errore riordino:', err);
        this.savingOrder = false;
        alert('Errore durante il salvataggio dell’ordine. Riprova.');
        this.loadAlbums(); // ripristina allo stato backend
      }
    });
  }
}

