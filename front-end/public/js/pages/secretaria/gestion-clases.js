import {
  createClass,
  deleteClass,
  getClasses,
  getRooms,
  updateClass,
} from '../../api/aula-api.js';
import { escapeHtml, optionList, pageHeader } from '../../utils/html.js';
import { table } from '../../components/table.js';

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];


function hasScheduleConflict(classes, data, currentId = '') {
  return classes.find((item) => {
    if (item.id === currentId) return false;
    if (String(item.salaId) !== String(data.salaId) || item.dia !== data.dia) return false;
    return data.inicio < item.fin && data.fin > item.inicio;
  });
}

function classForm(rooms, editing = null) {
  return `
    <form id="class-form" class="form-grid">
      <input type="hidden" name="id" value="${escapeHtml(editing?.id || '')}" />

      <label>
        Código <span class="optional">opcional</span>
        <input name="codigo" maxlength="100" value="${escapeHtml(editing?.codigo || '')}" />
      </label>

      <label>
        Asignatura
        <input name="asignatura" required maxlength="100" value="${escapeHtml(editing?.asignatura || '')}" />
      </label>

      <label>
        Sección
        <input name="seccion" type="number" min="1" max="99" required value="${escapeHtml(editing?.seccion || 1)}" />
      </label>

      <label>
        Profesor
        <input name="profesor" required maxlength="100" value="${escapeHtml(editing?.profesor || '')}" />
      </label>

      <label>
        Día
        <select name="dia" required>${optionList(days, editing?.dia || 'Lunes', null)}</select>
      </label>

      <label>
        Inicio
        <input name="inicio" type="time" required value="${escapeHtml(editing?.inicio || '08:30')}" />
      </label>

      <label>
        Término
        <input name="fin" type="time" required value="${escapeHtml(editing?.fin || '10:00')}" />
      </label>

      <label>
        Sede
        <input name="sede" required maxlength="100" placeholder="Ej. Valparaíso" value="${escapeHtml(editing?.sede || '')}" />
      </label>

      <label>
        Sala
        <select name="salaId" required>
          ${optionList(
            rooms.map((room) => [room.id, `${room.edificio} · Sala ${room.numero} · Piso ${room.piso}`]),
            editing?.salaId || '',
            'Selecciona una sala',
          )}
        </select>
      </label>

      <div class="form-actions">
        <button type="submit">${editing ? 'Guardar cambios' : 'Agregar clase'}</button>
        ${editing ? '<button type="button" class="secondary" data-action="cancel-edit">Cancelar</button>' : ''}
      </div>
    </form>
  `;
}

export async function renderClassManagementPage(container, context) {
  container.innerHTML = `
    ${pageHeader(
      'Secretaría',
      'Gestionar clases',
      'Agrega, edita o elimina los bloques de clase registrados.',
    )}
    <div id="class-management"><div class="loading">Cargando información…</div></div>
  `;

  const section = container.querySelector('#class-management');
  let editingId = null;
  let classes = [];
  let rooms = [];

  async function loadData() {
    try {
      [classes, rooms] = await Promise.all([getClasses(), getRooms()]);
      render();
    } catch (error) {
      section.innerHTML = `
        <section class="error-box" role="alert">
          <h2>No se pudo cargar la gestión de clases</h2>
          <p>${error.message}</p>
        </section>
      `;
    }
  }

  function render() {
    const editing = classes.find((item) => item.id === editingId) || null;
    const rows = classes.map(
      (item) => `
        <tr>
          <td>
            <strong>${escapeHtml(item.asignatura)}</strong>
            <small>${item.codigo ? `${escapeHtml(item.codigo)} · ` : ''}Sección ${escapeHtml(item.seccion)}</small>
          </td>
          <td>
            ${escapeHtml(item.dia)}
            <small>${escapeHtml(item.inicio)}–${escapeHtml(item.fin)}</small>
          </td>
          <td>
            ${escapeHtml(item.sala?.edificio || '—')}
            <small>Sala ${escapeHtml(item.sala?.numero || '—')}</small>
          </td>
          <td>
            <div class="table-actions">
              <button type="button" class="secondary" data-action="edit" data-id="${escapeHtml(item.id)}">Editar</button>
              <button type="button" class="danger" data-action="delete" data-id="${escapeHtml(item.id)}">Eliminar</button>
            </div>
          </td>
        </tr>
      `,
    );

    section.innerHTML = `
      <section class="form-section">
        <h2>${editing ? 'Editar clase' : 'Agregar clase'}</h2>
        ${classForm(rooms, editing)}
      </section>

      <section class="section">
        <h2>Clases registradas</h2>
        ${
          classes.length
            ? table(['Asignatura', 'Horario', 'Sala', 'Acciones'], rows)
            : '<div class="empty"><p>No hay clases registradas.</p></div>'
        }
      </section>
    `;

    bindEvents();
  }

  function bindEvents() {
    const form = section.querySelector('#class-form');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const id = String(formData.get('id') || '');
      const data = {
        codigo: String(formData.get('codigo') || '').trim(),
        asignatura: String(formData.get('asignatura') || '').trim(),
        seccion: Number(formData.get('seccion')),
        profesor: String(formData.get('profesor') || '').trim(),
        dia: String(formData.get('dia') || ''),
        inicio: String(formData.get('inicio') || ''),
        fin: String(formData.get('fin') || ''),
        sede: String(formData.get('sede') || '').trim(),
        salaId: String(formData.get('salaId') || ''),
      };

      if (data.inicio >= data.fin) {
        context.notify('La hora de término debe ser posterior al inicio.', true);
        return;
      }

      const conflict = hasScheduleConflict(classes, data, id);
      if (conflict) {
        context.notify(
          `Conflicto de sala: ya está ocupada por ${conflict.asignatura} entre ${conflict.inicio} y ${conflict.fin}.`,
          true,
        );
        return;
      }

      try {
        if (id) {
          await updateClass(id, data);
          context.notify('Cambios guardados correctamente.');
        } else {
          await createClass(data);
          context.notify('Clase guardada correctamente.');
        }

        editingId = null;
        await loadData();
      } catch (error) {
        context.notify(error.message, true);
      }
    });

    section.querySelectorAll('[data-action="edit"]').forEach((button) => {
      button.addEventListener('click', () => {
        editingId = button.dataset.id;
        render();
      });
    });

    section.querySelectorAll('[data-action="delete"]').forEach((button) => {
      button.addEventListener('click', async () => {
        const item = classes.find((classItem) => classItem.id === button.dataset.id);
        if (!item || !window.confirm(`¿Eliminar ${item.asignatura}, sección ${item.seccion}?`)) return;

        try {
          await deleteClass(item.id);
          context.notify('Clase eliminada.');
          editingId = null;
          await loadData();
        } catch (error) {
          context.notify(error.message, true);
        }
      });
    });

    section.querySelector('[data-action="cancel-edit"]')?.addEventListener('click', () => {
      editingId = null;
      render();
    });
  }

  await loadData();
}
