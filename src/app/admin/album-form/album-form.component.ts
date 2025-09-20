import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { AlbumApiService, Album } from '../../services/album-api.service';

@Component({
  selector: 'app-album-form',
  templateUrl: './album-form.component.html',
  styleUrls: ['./album-form.component.scss']
})
export class AlbumFormComponent implements OnInit {
  form!: FormGroup;
  isBrowser = false;
  albums$!: Observable<Album[]>;
  editingId: string | null = null;

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

    // Carica lista album dal backend
    this.albums$ = this.api.getAlbums();
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
      photos: raw.photos || []
    };

    if (this.editingId) {
      // Aggiornamento album
      this.api.updateAlbum(this.editingId, payload).subscribe({
        next: () => {
          alert($localize`:@@update:Album aggiornato con successo!`);
          this.resetForm();
          this.albums$ = this.api.getAlbums();
        },
        error: () => alert('Errore durante l’aggiornamento dell’album')
      });
    } else {
      // Creazione album
      this.api.createAlbum(payload).subscribe({
        next: () => {
          alert($localize`:@@album.saved:Album salvato con successo!`);
          this.resetForm();
          this.albums$ = this.api.getAlbums();
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
      next: () => {
        this.albums$ = this.api.getAlbums();
      },
      error: () => alert('Errore durante l’eliminazione dell’album')
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset();
    this.photos.clear();
    this.addPhoto();
  }
}

