import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/layout/shell/component').then(m => m.ShellComponent),
        children: [
            { path: '', redirectTo: 'testComponents', pathMatch: 'full' },
            { path: 'testComponents', loadComponent: () => import('./pages/test-components/component').then(m => m.TestComponentsComponent) }
        ]
    }
];
