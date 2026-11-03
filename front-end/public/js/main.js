import { getConfig, setApiRole } from './api/aula-api.js';
import { clearSession, getSession, renderAccess } from './auth/access.js';
import {
  firstRouteForRole,
  renderNavigation,
  roleCanOpen,
} from './components/navigation.js';
import { renderRoomManagementPage } from './pages/administrador/gestion-salas.js';
import { renderReportsPage } from './pages/consultas/reportes.js';
import { renderSearchPage } from './pages/estudiante/buscar.js';
import { renderSchedulePage } from './pages/estudiante/horario.js';
import { renderRoomsPage } from './pages/estudiante/salas.js';
import { renderClassManagementPage } from './pages/secretaria/gestion-clases.js';

const authRoot = document.querySelector('#auth-root');
const shell = document.querySelector('#app-shell');
const app = document.querySelector('#app');
const navigation = document.querySelector('#navegacion');
const apiMode = document.querySelector('#modo-api');
const message = document.querySelector('#mensaje');
const activeUser = document.querySelector('#usuario-activo');
const activeRole = document.querySelector('#perfil-activo');
const logoutButton = document.querySelector('#cerrar-sesion');

const roleLabels = {
  estudiante: 'Estudiante',
  secretaria: 'Secretaría',
  administrador: 'Administración',
};

const state = {
  role: 'estudiante',
  route: 'buscar',
  filters: { q: '', dia: '', seccion: '' },
  classes: [],
};

const pages = {
  buscar: renderSearchPage,
  horario: renderSchedulePage,
  salas: renderRoomsPage,
  'gestion-clases': renderClassManagementPage,
  'gestion-salas': renderRoomManagementPage,
  consultas: renderReportsPage,
};

let messageTimer;

function notify(text, isError = false) {
  clearTimeout(messageTimer);
  message.textContent = text;
  message.dataset.kind = isError ? 'error' : 'success';

  messageTimer = setTimeout(() => {
    message.textContent = '';
    delete message.dataset.kind;
  }, 5000);
}

function currentRoute() {
  return location.hash.replace(/^#/, '') || firstRouteForRole(state.role);
}

async function renderCurrentPage() {
  if (shell.hidden) return;

  const requestedRoute = currentRoute();

  if (!roleCanOpen(state.role, requestedRoute)) {
    location.hash = firstRouteForRole(state.role);
    return;
  }

  state.route = requestedRoute;
  renderNavigation(navigation, state.role, state.route);

  const renderPage = pages[state.route];
  if (!renderPage) return;

  app.innerHTML = '<div class="loading">Cargando pantalla…</div>';

  try {
    await renderPage(app, {
      ...state,
      notify,
      get filters() {
        return state.filters;
      },
      set filters(value) {
        state.filters = value;
      },
      get classes() {
        return state.classes;
      },
      set classes(value) {
        state.classes = value;
      },
    });
  } catch (error) {
    app.innerHTML = `
      <section class="error-box" role="alert">
        <h2>No se pudo abrir esta pantalla</h2>
        <p>${error.message}</p>
      </section>
    `;
  }
}

async function checkApiMode() {
  try {
    const config = await getConfig();
    apiMode.textContent = config.modo === 'demo' ? 'Modo demo local' : 'Backend NoSQL conectado';
    apiMode.dataset.status = 'connected';
  } catch {
    apiMode.textContent = 'Backend sin conexión';
    apiMode.dataset.status = 'disconnected';
  }
}

async function startApp(session) {
  authRoot.innerHTML = '';
  shell.hidden = false;
  state.role = session.rol;
  state.filters = { q: '', dia: '', seccion: '' };
  setApiRole(state.role);
  activeUser.textContent = session.nombre;
  activeRole.textContent = roleLabels[state.role] || state.role;

  if (!roleCanOpen(state.role, currentRoute())) {
    location.hash = firstRouteForRole(state.role);
  }

  await checkApiMode();
  await renderCurrentPage();
}

function showAccess() {
  shell.hidden = true;
  renderAccess(authRoot, startApp);
}

logoutButton.addEventListener('click', () => {
  clearSession();
  location.hash = '';
  showAccess();
});

window.addEventListener('hashchange', renderCurrentPage);

const session = getSession();
if (session) {
  await startApp(session);
} else {
  showAccess();
}
