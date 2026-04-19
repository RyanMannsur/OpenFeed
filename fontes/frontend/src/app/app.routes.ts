import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'testComponents', pathMatch: 'full' },
    { path: 'testComponents', loadComponent: () => import('./pages/test-components/component').then(m => m.TestComponentsComponent) }
];
