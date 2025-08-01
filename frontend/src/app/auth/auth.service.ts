import { Injectable } from '@angular/core';
import { User } from '../entity/user';
import { jwtDecode } from 'jwt-decode';
import { Mentor } from '../entity/mentor';
import {Mentored} from '../entity/mentored';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private apiUrlMentor = 'http://localhost:8080/mentor';
  private apiUrlMentored = 'http://localhost:8080/mentored';

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(this.apiUrl + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Erro desconhecido' }));
        const error = new Error(errorData.message || 'Login falhou');
        (error as any).status = response.status;
        throw error;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      return true;
    } catch (error) {
      console.error('Erro ao fazer login no AuthService:', error);
      throw error;
    }
  }

  async register(newUser: User): Promise<User | null> {
    try {
      const response = await fetch(this.apiUrl + '/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Erro desconhecido' }));
        const error = new Error(errorData.message || 'Registro falhou');
        (error as any).status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao registrar usuário no AuthService:', error);
      throw error;
    }
  }

  async registerMentor(newMentor: Mentor): Promise<Mentor | null> {
    try {
      const response = await fetch(this.apiUrlMentor, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newMentor),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Erro desconhecido' }));
        const error = new Error(errorData.message || 'Registro falhou');
        (error as any).status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao registrar Mentor no AuthService:', error);
      throw error;
    }
  }

  async registerMentoroed(newMentored: Mentored): Promise<Mentor | null> {
    try {
      const response = await fetch(this.apiUrlMentored, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newMentored),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Erro desconhecido' }));
        const error = new Error(errorData.message || 'Registro falhou');
        (error as any).status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao registrar Mentored no AuthService:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.roles?.includes(role) || false;
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
