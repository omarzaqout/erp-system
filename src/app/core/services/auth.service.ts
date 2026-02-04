import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  private mockUser: User = {
    id: '1',
    email: 'admin@erp.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'Administrator',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0070C0&color=fff'
  };

  constructor(private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<boolean> {
    // Mock authentication
    if (email === 'admin@erp.com' && password === 'admin') {
      localStorage.setItem('currentUser', JSON.stringify(this.mockUser));
      localStorage.setItem('token', 'mock-jwt-token');
      this.currentUserSubject.next(this.mockUser);
      return of(true);
    }
    return of(false);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
