const ACCOUNTS_KEY = 'aula_uv_accounts';
const SESSION_KEY = 'aula_uv_session';

const demoAccounts = [
  {
    nombre: 'Estudiante UV',
    correo: 'estudiante@alumnos.uv.cl',
    contrasena: 'aula123',
    rol: 'estudiante',
  },
  {
    nombre: 'Secretaría UV',
    correo: 'secretaria@uv.cl',
    contrasena: 'aula123',
    rol: 'secretaria',
  },
  {
    nombre: 'Administrador UV',
    correo: 'admin@uv.cl',
    contrasena: 'aula123',
    rol: 'administrador',
  },
];

function getRegisteredAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRegisteredAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function setSession(account) {
  const session = {
    nombre: account.nombre,
    correo: account.correo,
    rol: account.rol,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function showFeedback(container, message, kind = 'error') {
  const feedback = container.querySelector('[data-auth-feedback]');
  feedback.textContent = message;
  feedback.dataset.kind = kind;
}

function loginView() {
  return `
    <div class="auth-heading auth-heading-login">
      <span class="auth-eyebrow">Acceso institucional</span>
      <h1>Iniciar sesión</h1>
      <p>Ingresa con tu correo UV para acceder a salas y horarios.</p>
    </div>

    <form class="auth-form" data-auth-form="login">
      <label class="auth-field">
        <span>Correo institucional</span>
        <span class="auth-input-wrap">
          <span class="auth-input-icon" aria-hidden="true">@</span>
          <input type="email" name="correo" autocomplete="email" required placeholder="nombre@uv.cl" />
        </span>
      </label>

      <label class="auth-field">
        <span>Contraseña</span>
        <span class="auth-input-wrap">
          <span class="auth-input-icon auth-lock" aria-hidden="true"></span>
          <input type="password" name="contrasena" autocomplete="current-password" required minlength="6" placeholder="••••••••" />
        </span>
      </label>

      <div class="auth-login-options">
        <label class="auth-remember">
          <input type="checkbox" name="recordar" />
          <span>Recordarme</span>
        </label>
        <button type="button" class="link-button" data-auth-view="recover">¿Olvidaste tu contraseña?</button>
      </div>

      <div class="auth-feedback" data-auth-feedback aria-live="polite"></div>

      <button type="submit" class="auth-submit">Ingresar</button>
    </form>

    <div class="auth-links auth-links-login">
      <span>¿Primera vez en Aula UV?</span>
      <button type="button" class="link-button" data-auth-view="register">Crear cuenta</button>
    </div>
  `;
}

function registerView() {
  return `
    <div class="auth-heading">
      <p class="page-kicker">Registro</p>
      <h1>Crear cuenta</h1>
      <p>Registro disponible para estudiantes.</p>
    </div>

    <form class="auth-form" data-auth-form="register">
      <label>
        Nombre completo
        <input name="nombre" required maxlength="80" autocomplete="name" />
      </label>

      <label>
        Correo institucional
        <input type="email" name="correo" required autocomplete="email" placeholder="nombre@alumnos.uv.cl" />
      </label>

      <label>
        Contraseña
        <input type="password" name="contrasena" required minlength="6" autocomplete="new-password" />
      </label>

      <label>
        Repetir contraseña
        <input type="password" name="confirmacion" required minlength="6" autocomplete="new-password" />
      </label>

      <div class="auth-feedback" data-auth-feedback aria-live="polite"></div>

      <button type="submit">Crear cuenta</button>
    </form>

    <div class="auth-links">
      <button type="button" class="link-button" data-auth-view="login">Volver a iniciar sesión</button>
    </div>
  `;
}

function recoverView() {
  return `
    <div class="auth-heading">
      <p class="page-kicker">Recuperación</p>
      <h1>Recuperar contraseña</h1>
      <p>Ingresa tu correo institucional para solicitar el restablecimiento.</p>
    </div>

    <form class="auth-form" data-auth-form="recover">
      <label>
        Correo institucional
        <input type="email" name="correo" required autocomplete="email" />
      </label>

      <div class="auth-feedback" data-auth-feedback aria-live="polite"></div>

      <button type="submit">Enviar solicitud</button>
    </form>

    <div class="auth-links">
      <button type="button" class="link-button" data-auth-view="login">Volver a iniciar sesión</button>
    </div>
  `;
}

export function renderAccess(container, onAuthenticated) {
  function render(view = 'login') {
    const content = view === 'register' ? registerView() : view === 'recover' ? recoverView() : loginView();

    container.innerHTML = `
      <section class="auth-page">
        <div class="auth-scenery" aria-hidden="true">
          <span class="auth-mountain auth-mountain-one"></span>
          <span class="auth-mountain auth-mountain-two"></span>
          <span class="auth-mountain auth-mountain-three"></span>
        </div>

        <div class="auth-card-shell">
          <div class="auth-visual">
            <div class="auth-sky-shape auth-sky-shape-one"></div>
            <div class="auth-sky-shape auth-sky-shape-two"></div>
            <div class="auth-campus-mark">
              <img src="/assets/logo-uv.png" alt="Universidad de Valparaíso" />
            </div>
            <div class="auth-visual-copy">
              <strong>Aula UV</strong>
              <span>Salas y horarios en un solo lugar</span>
            </div>
          </div>

          <div class="auth-card">${content}</div>
        </div>
      </section>
    `;

    container.querySelectorAll('[data-auth-view]').forEach((button) => {
      button.addEventListener('click', () => render(button.dataset.authView));
    });

    const form = container.querySelector('[data-auth-form]');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const type = form.dataset.authForm;

      if (type === 'login') {
        const correo = String(data.get('correo') || '').trim().toLowerCase();
        const contrasena = String(data.get('contrasena') || '');
        const accounts = [...demoAccounts, ...getRegisteredAccounts()];
        const account = accounts.find(
          (item) => item.correo.toLowerCase() === correo && item.contrasena === contrasena,
        );

        if (!account) {
          showFeedback(container, 'Correo o contraseña incorrectos.');
          return;
        }

        onAuthenticated(setSession(account));
        return;
      }

      if (type === 'register') {
        const nombre = String(data.get('nombre') || '').trim();
        const correo = String(data.get('correo') || '').trim().toLowerCase();
        const contrasena = String(data.get('contrasena') || '');
        const confirmacion = String(data.get('confirmacion') || '');

        if (contrasena !== confirmacion) {
          showFeedback(container, 'Las contraseñas no coinciden.');
          return;
        }

        const accounts = getRegisteredAccounts();
        const exists = [...demoAccounts, ...accounts].some(
          (item) => item.correo.toLowerCase() === correo,
        );

        if (exists) {
          showFeedback(container, 'Ya existe una cuenta con ese correo.');
          return;
        }

        const account = { nombre, correo, contrasena, rol: 'estudiante' };
        accounts.push(account);
        saveRegisteredAccounts(accounts);
        onAuthenticated(setSession(account));
        return;
      }

      const correo = String(data.get('correo') || '').trim();
      showFeedback(
        container,
        `Si ${correo} está registrado, recibirá las instrucciones de recuperación.`,
        'success',
      );
    });
  }

  render();
}
