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
            { path: 'testComponents', loadComponent: () => import('./pages/test-components/component').then(m => m.TestComponentsComponent) },
            { path: 'my-profile', loadComponent: () => import('./pages/my-profile/component').then(m => m.MyProfileComponent) },
            { path: 'article-create', loadComponent: () => import('./pages/article-create/component').then(m => m.ArticleCreateComponent) },
            { path: 'article-edit/:id', loadComponent: () => import('./pages/article-edit/component').then(m => m.ArticleEditComponent) },
            { path: 'article-read/:id', loadComponent: () => import('./pages/article-read/component').then(m => m.ArticleReadComponent) },
            { path: 'user/:id', loadComponent: () => import('./pages/user-profile/component').then(m => m.UserProfileComponent) },
            { path: 'my-user', loadComponent: () => import('./pages/user-profile/component').then(m => m.UserProfileComponent) }
        ]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    }
];
