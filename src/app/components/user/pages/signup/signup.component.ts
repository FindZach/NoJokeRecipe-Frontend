// In your signup component
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {AuthService} from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  error = '';

  // Make these public so they can be accessed from template
  public formControls: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });

    // Initialize formControls for template access
    this.formControls = {
      name: this.signupForm.get('name'),
      email: this.signupForm.get('email'),
      password: this.signupForm.get('password'),
      confirmPassword: this.signupForm.get('confirmPassword')
    };
  }

  // Public helper methods for template
  public isInvalid(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!control && control.touched && control.invalid;
  }

  public hasError(controlName: string, errorName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!control && control.touched && !!control.errors?.[errorName];
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit() {
    // Stop if form is invalid
    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.signup(
      this.signupForm.get('name')?.value,
      this.signupForm.get('email')?.value,
      this.signupForm.get('password')?.value
    ).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: error => {
        this.error = error.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
