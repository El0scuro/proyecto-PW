import { getClasses } from '../../api/aula-api.js';
import { classCard } from '../../components/class-card.js';
import { emptyState, optionList, pageHeader } from '../../utils/html.js';
import { getSavedClassIds, toggleSavedClass } from '../../utils/storage.js';

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export async function renderSearchPage(container, context) {
  const filters = context.filters ?? { q: '', dia: '', seccion: '' };

  container.innerHTML = `
    ${pageHeader(
      'Estudiante',
      'Buscar clase',
      'Busca por asignatura, código o profesor y revisa la sala antes de ir a clases.',
    )}

    <form id="search-form" class="filters">
      <label>
        Asignatura o profesor
        <input
          type="search"
          name="q"
          value="${filters.q}"
          placeholder="Ej. Álgebra o nombre del profesor"
          maxlength="100"
        />
      </label>

      <label>
        Día
        <select name="dia">
          ${optionList(days, filters.dia, 'Todos')}
        </select>
      </label>

      <label>
        Sección
        <select name="seccion" id="section-filter">
          <option value="">Todas</option>
        </select>
      </label>

      <button type="submit">Buscar clase</button>
    </form>

    <div id="search-result" class="section">
      <div class="loading">Cargando clases…</div>
    </div>
  `;

  const form = container.querySelector('#search-form');
  const result = container.querySelector('#search-result');

  async function loadClasses(nextFilters = filters) {
    context.filters = nextFilters;

    try {
      const classes = await getClasses(nextFilters);
      const allClasses = await getClasses();
      context.classes = allClasses;

      const sections = [...new Set(allClasses.map((item) => item.seccion))].sort(
        (a, b) => Number(a) - Number(b),
      );
      const sectionSelect = container.querySelector('#section-filter');
      sectionSelect.innerHTML = optionList(sections, nextFilters.seccion, 'Todas');

      const savedIds = getSavedClassIds();

      result.innerHTML = classes.length
        ? `
          <div class="result-header">
            <strong>${classes.length} ${classes.length === 1 ? 'clase encontrada' : 'clases encontradas'}</strong>
            <button class="link-button" type="button" data-action="clear-filters">
              Limpiar filtros
            </button>
          </div>
          <div class="cards">
            ${classes.map((item) => classCard(item, savedIds)).join('')}
          </div>
        `
        : emptyState('No encontramos clases', 'Prueba con otro nombre, código, día o sección.');
    } catch (error) {
      result.innerHTML = `
        <section class="error-box" role="alert">
          <h2>No se pudieron cargar las clases</h2>
          <p>${error.message}</p>
        </section>
      `;
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);

    loadClasses({
      q: String(data.get('q') ?? ''),
      dia: String(data.get('dia') ?? ''),
      seccion: String(data.get('seccion') ?? ''),
    });
  });

  result.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;

    if (button.dataset.action === 'guardar-clase') {
      toggleSavedClass(button.dataset.id);
      context.notify('Horario actualizado.');
      loadClasses(context.filters);
    }

    if (button.dataset.action === 'clear-filters') {
      form.reset();
      loadClasses({ q: '', dia: '', seccion: '' });
    }
  });

  await loadClasses(filters);
}
