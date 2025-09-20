// src/app/pages/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [{ value: this.auth['ADMIN_EMAIL'], disabled: true }], // campo fisso
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = null;

    const email = this.auth['ADMIN_EMAIL']; // sempre l’admin
    const password = this.loginForm.get('password')?.value;

    this.auth.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/album-form']); // rotta protetta
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Credenziali non valide.';
      }
    });
  }
}

