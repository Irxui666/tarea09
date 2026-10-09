export interface MenuItem {
  etiqueta: string;
  ruta: string;
  icono: string;
}
export const MENU: MenuItem[] = [
  { etiqueta: 'Inicio', ruta: '/inicio', icono: '🏠' },
  { etiqueta: 'Pacientes', ruta: '/pacientes', icono: '👥' },
  { etiqueta: 'Especialidades', ruta: '/especialidades', icono: '🩺' },
  { etiqueta: 'Procedimientos', ruta: '/procedimientos', icono: '📋' },
  { etiqueta: 'Atenciones', ruta: '/atenciones', icono: '🏥' },
  { etiqueta: 'Reportes', ruta: '/reportes', icono: '📊' },
];
