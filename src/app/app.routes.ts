import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        title: 'Historia Clínica',
        loadComponent: () => import('./features/inicio/inicio').then((m) => m.Inicio),
      },
      ...['pacientes', 'especialidades', 'procedimientos'].map((recurso) => ({
        path: recurso,
        title: recurso[0].toUpperCase() + recurso.slice(1),
        data: { recurso },
        loadComponent: () => import('./features/clinica/catalogo').then((m) => m.Catalogo),
      })),
      {
        path: 'atenciones',
        title: 'Atenciones',
        loadComponent: () => import('./features/clinica/atenciones').then((m) => m.Atenciones),
      },
      {
        path: 'reportes',
        title: 'Reportes',
        loadComponent: () => import('./features/clinica/reportes').then((m) => m.Reportes),
      },
      { path: 'categorias', redirectTo: 'especialidades', pathMatch: 'full' },
    ],
  },
  {
    path: '**',
    title: 'Página no encontrada',
    loadComponent: () =>
      import('./shared/pages/no-encontrado/no-encontrado').then((m) => m.NoEncontrado),
  },
];
