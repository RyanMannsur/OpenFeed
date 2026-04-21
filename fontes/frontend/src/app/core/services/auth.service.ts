import { isPlatformBrowser } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';

import { AuthCredentials, AuthSession, AuthUser, MockApiRequest, MockApiResponse, RegisterPayload } from '../../shared/types/auth';

interface MockUserRecord extends AuthUser {
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly usersStorageKey = 'openfeed.mock.users';
  private readonly sessionStorageKey = 'openfeed.mock.session';

  private readonly defaultUsers: MockUserRecord[] = [
    {
      id: 1,
      name: 'Ryan Mansur',
      email: 'ryan.emv@gmail.com',
      password: '1234',
      role: 'user'
    },
    {
      id: 2,
      name: 'Opinion',
      email: 'adm@gmail.com',
      password: '1234',
      role: 'admin'
    }
  ];

  private readonly usersSignal = signal<MockUserRecord[]>(this.loadUsers());
  private readonly currentUserSignal = signal<AuthUser | null>(this.loadSession());

  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  login(credentials: AuthCredentials): Observable<MockApiResponse<AuthSession>> {
    const request: MockApiRequest<AuthCredentials> = {
      method: 'POST',
      url: '/auth/login',
      body: credentials
    };

    return this.simulateRequest(request, () => {
      const user = this.findUser(credentials.email, credentials.password);

      if (!user) {
        throw new Error('Usuário ou senha inválidos.');
      }

      const session = this.createSession(this.toPublicUser(user));
      this.persistSession(session.user);

      return session;
    });
  }

  register(payload: RegisterPayload): Observable<MockApiResponse<AuthUser>> {
    const request: MockApiRequest<RegisterPayload> = {
      method: 'POST',
      url: '/auth/register',
      body: payload
    };

    return this.simulateRequest(request, () => {
      const normalizedEmail = payload.email.trim().toLowerCase();

      if (!payload.name.trim() || !normalizedEmail || !payload.password.trim()) {
        throw new Error('Preencha todos os campos para continuar.');
      }

      if (this.usersSignal().some((user) => user.email.toLowerCase() === normalizedEmail)) {
        throw new Error('Já existe um usuário cadastrado com este e-mail.');
      }

      const newUser: MockUserRecord = {
        id: this.nextUserId(),
        name: payload.name.trim(),
        email: normalizedEmail,
        password: payload.password,
        role: 'user'
      };

      const updatedUsers = [...this.usersSignal(), newUser];
      this.usersSignal.set(updatedUsers);

      return this.toPublicUser(newUser);
    });
  }

  logout(): void {
    this.currentUserSignal.set(null);

    if (this.canUseStorage()) {
      window.localStorage.removeItem(this.sessionStorageKey);
    }
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSignal();
  }

  private findUser(email: string, password: string): MockUserRecord | undefined {
    const normalizedEmail = email.trim().toLowerCase();

    return this.usersSignal().find((user) => user.email.toLowerCase() === normalizedEmail && user.password === password);
  }

  private createSession(user: AuthUser): AuthSession {
    return {
      token: `mock-token-${user.id}-${Date.now()}`,
      user,
      loginAt: new Date().toISOString()
    };
  }

  private toPublicUser(user: MockUserRecord): AuthUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  private nextUserId(): number {
    return Math.max(...this.usersSignal().map((user) => user.id), 0) + 1;
  }

  private simulateRequest<TData, TBody>(request: MockApiRequest<TBody>, handler: () => TData): Observable<MockApiResponse<TData>> {
    return of(null).pipe(
      delay(500),
      map(() => ({
        request,
        message: 'Requisição mock processada com sucesso.',
        data: handler()
      }))
    );
  }

  private loadUsers(): MockUserRecord[] {
    if (this.canUseStorage()) {
      window.localStorage.removeItem(this.usersStorageKey);
    }

    return [...this.defaultUsers];
  }

  private loadSession(): AuthUser | null {
    if (!this.canUseStorage()) {
      return null;
    }

    const rawSession = window.localStorage.getItem(this.sessionStorageKey);

    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as AuthUser;
    } catch {
      return null;
    }
  }

  private persistSession(user: AuthUser): void {
    this.currentUserSignal.set(user);

    if (!this.canUseStorage()) {
      return;
    }

    window.localStorage.setItem(this.sessionStorageKey, JSON.stringify(user));
  }

  private canUseStorage(): boolean {
    return isPlatformBrowser(this.platformId) && typeof window !== 'undefined';
  }
}