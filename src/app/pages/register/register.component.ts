// src/app/pages/register/register.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(fg: FormGroup) {
    const password = fg.get('password')?.value;
    const confirmPassword = fg.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.isLoading = false;
      this.errorMessage = 'Per favore, compila tutti i campi richiesti e assicurati che le password coincidano.';
      return;
    }

    const { email, password } = this.registerForm.value;

    this.authService.register(email, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Registrazione completata! Effettuato il login.';
        this.snackBar.open(this.successMessage, 'Chiudi', { duration: 3000 });
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 400 && error.error && error.error.msg === 'Utente già registrato') {
          this.errorMessage = 'Questa email è già registrata. Per favore, prova ad accedere.';
        } else {
          this.errorMessage = error.message || 'Si è verificato un errore durante la registrazione. Riprova.';
        }
        this.snackBar.open(this.errorMessage ?? 'Errore sconosciuto', 'Chiudi', { panelClass: ['snackbar-error'] });
        console.error('Errore di registrazione:', error);
      }
    });
  }
}
