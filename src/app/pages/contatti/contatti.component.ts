// src/app/pages/contatti/contatti.component.ts
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment'; // Usa l'ambiente corretto

@Component({
  selector: 'app-contatti',
  templateUrl: './contatti.component.html',
  styleUrls: ['./contatti.component.scss']
})
export class ContattiComponent implements OnInit {
  contactForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  private backendUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.contactForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      cellulare: ['', [Validators.pattern(/^(\+?\d{1,3}[- ]?)?\d{6,14}$/)]],
      messaggio: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.contactForm.valid) {
      this.isLoading = true;
      const formData = this.contactForm.value;

      // L'endpoint sarà /b-api/contatti se usi il proxy, o /api/contatti
      this.http.post(`${this.backendUrl}/contatti`, formData).subscribe({
        next: () => {
          this.successMessage = 'Messaggio inviato con successo!';
          this.snackBar.open(this.successMessage, 'Chiudi', { duration: 3000, panelClass: ['success'] });
          this.contactForm.reset();
          // Pulisce lo stato di validazione del form
          Object.keys(this.contactForm.controls).forEach(key => {
            this.contactForm.get(key)?.setErrors(null) ;
            this.contactForm.get(key)?.markAsUntouched();
          });
        },
        error: (error) => {
          console.error('Errore invio messaggio:', error);
          this.errorMessage = 'Errore durante l\'invio del messaggio. Riprova.';
          this.snackBar.open(this.errorMessage, 'Chiudi', { duration: 5000, panelClass: ['error'] });
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.contactForm.markAllAsTouched();
      this.errorMessage = 'Per favore, compila correttamente tutti i campi obbligatori.';
      this.snackBar.open(this.errorMessage, 'Chiudi', { duration: 5000, panelClass: ['error'] });
    }
  }
}

