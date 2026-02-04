import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  phone: string;
  joinDate: Date;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private mockUsers: UserProfile[] = [
    {
      id: '1',
      email: 'admin@erp.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'Administrator',
      department: 'IT',
      phone: '+1 234 567 890',
      joinDate: new Date('2020-01-15'),
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0070C0&color=fff'
    },
    {
      id: '2',
      email: 'manager@erp.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'Manager',
      department: 'Sales',
      phone: '+1 234 567 891',
      joinDate: new Date('2020-03-20'),
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=28A745&color=fff'
    },
    {
      id: '3',
      email: 'user@erp.com',
      firstName: 'Bob',
      lastName: 'Johnson',
      role: 'User',
      department: 'Finance',
      phone: '+1 234 567 892',
      joinDate: new Date('2021-06-10'),
      avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=FF6B35&color=fff'
    }
  ];

  constructor() { }

  getUsers(): Observable<UserProfile[]> {
    return of(this.mockUsers);
  }

  getUserById(id: string): Observable<UserProfile | undefined> {
    return of(this.mockUsers.find(user => user.id === id));
  }

  updateUser(user: UserProfile): Observable<UserProfile> {
    const index = this.mockUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.mockUsers[index] = user;
    }
    return of(user);
  }
}
