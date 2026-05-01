import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login/component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/register/component').then(m => m.RegisterComponent)
    },
    {
        path: '',
        canMatch: [authGuard],
        loadComponent: () => import('./features/layout/shell/component').then(m => m.ShellComponent),
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', loadComponent: () => import('./pages/home/component').then(m => m.HomeComponent) },
            { path: 'testComponents', loadComponent: () => import('./pages/test-components/component').then(m => m.TestComponentsComponent) }
        ]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    }
];
