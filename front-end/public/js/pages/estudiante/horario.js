import { getClasses } from '../../api/aula-api.js';
import { emptyState, escapeHtml, pageHeader } from '../../utils/html.js';
import {
  getSavedClassIds,
  removeMissingSavedClasses,
  toggleSavedClass,
} from '../../utils/storage.js';

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export async function renderSchedulePage(container, context) {
  container.innerHTML = `
    ${pageHeader(
      'Estudiante',
      'Mi horario',
      'Aquí aparecen las clases que guardaste en este navegador.',
    )}
    <div id="schedule-content"><div class="loading">Cargando horario…</div></div>
  `;

  const content = container.querySelector('#schedule-content');

  async function loadSchedule() {
    try {
      const classes = await getClasses();
      context.classes = classes;

      const savedIds = getSavedClassIds();
      const validIds = classes.map((item) => item.id);
      const cleanedIds = removeMissingSavedClasses(validIds);
      const savedClasses = classes.filter((item) => cleanedIds.includes(item.id));

      if (!savedClasses.length) {
        content.innerHTML = emptyState(
          'Tu horario está vacío',
          'Busca una clase y usa “Agregar a mi horario”.',
        );
        return;
      }

      content.innerHTML = `
        <div class="page-header">
          <div></div>
          <button type="button" class="secondary" data-action="print">Imprimir horario</button>
        </div>

        <div class="schedule-list">
          ${days
            .flatMap((day) => {
              const items = savedClasses.filter((item) => item.dia === day);

              return items.map(
                (item) => `
                  <article class="schedule-item">
                    <div class="schedule-time">
                      ${escapeHtml(item.inicio)}<br />
                      <small>${escapeHtml(item.fin)}</small>
                    </div>

                    <div>
                      <h3>${escapeHtml(item.asignatura)} · Sección ${escapeHtml(item.seccion)}</h3>
                      <p>
                        ${escapeHtml(item.dia)} · ${escapeHtml(item.sala?.edificio || 'Edificio sin informar')}
                        · Sala ${escapeHtml(item.sala?.numero || '—')}
                      </p>
                    </div>

                    <button
                      type="button"
                      class="secondary"
                      data-action="remove"
                      data-id="${escapeHtml(item.id)}"
                    >
                      Quitar
                    </button>
                  </article>
                `,
              );
            })
            .join('')}
        </div>
      `;

      if (savedIds.length !== cleanedIds.length) {
        context.notify('Se quitaron referencias a clases que ya no existen.');
      }
    } catch (error) {
      content.innerHTML = `
        <section class="error-box" role="alert">
          <h2>No se pudo cargar el horario</h2>
          <p>${error.message}</p>
        </section>
      `;
    }
  }

  content.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;

    if (button.dataset.action === 'remove') {
      toggleSavedClass(button.dataset.id);
      context.notify('Clase quitada de tu horario.');
      loadSchedule();
    }

    if (button.dataset.action === 'print') {
      window.print();
    }
  });

  await loadSchedule();
}
