const linksByRole = {
  estudiante: [
    ['buscar', 'Buscar clase'],
    ['horario', 'Mi horario'],
    ['salas', 'Salas y edificios'],
  ],
  secretaria: [
    ['buscar', 'Buscar clase'],
    ['salas', 'Salas y edificios'],
    ['gestion-clases', 'Gestionar clases'],
    ['consultas', 'Consultas'],
  ],
  administrador: [
    ['buscar', 'Buscar clase'],
    ['salas', 'Salas y edificios'],
    ['gestion-clases', 'Gestionar clases'],
    ['gestion-salas', 'Gestionar salas'],
    ['consultas', 'Consultas'],
  ],
};

export function renderNavigation(container, role, currentRoute) {
  container.innerHTML = linksByRole[role]
    .map(([route, label]) => {
      const active = route === currentRoute ? 'active' : '';
      const current = route === currentRoute ? 'aria-current="page"' : '';

      return `<a class="${active}" ${current} href="#${route}">${label}</a>`;
    })
    .join('');
}

export function firstRouteForRole(role) {
  return linksByRole[role][0][0];
}

export function roleCanOpen(role, route) {
  return linksByRole[role].some(([availableRoute]) => availableRoute === route);
}
