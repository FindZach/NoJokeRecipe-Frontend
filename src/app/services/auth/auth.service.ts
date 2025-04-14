import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, AuthResponse } from '../../models/user/user-data.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/recipes';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    // Try to load user from localStorage on init (for browser)
    if (typeof localStorage !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          this.currentUserSubject.next(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem('currentUser');
        }
      }
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => this.setSession(response)),
        map(response => response.user),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => new Error(error.error?.message || 'Login failed'));
        })
      );
  }

  signup(name: string, email: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, { name, email, password })
      .pipe(
        tap(response => this.setSession(response)),
        map(response => response.user),
        catchError(error => {
          console.error('Signup error:', error);
          return throwError(() => new Error(error.error?.message || 'Signup failed'));
        })
      );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('tokenExpiry');
    }

    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private setSession(authResult: AuthResponse): void {
    if (typeof localStorage !== 'undefined') {
      // Store auth data in localStorage
      localStorage.setItem('token', authResult.token);
      localStorage.setItem('currentUser', JSON.stringify(authResult.user));

      // Set token expiry (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      localStorage.setItem('tokenExpiry', expiresAt.toISOString());

      this.currentUserSubject.next(authResult.user);
    }
  }

  private isTokenExpired(): boolean {
    if (typeof localStorage !== 'undefined') {
      const expiry = localStorage.getItem('tokenExpiry');
      if (!expiry) return true;

      return new Date() > new Date(expiry);
    }
    return true;
  }
}
