import {
  createRoom,
  deleteRoom,
  getRooms,
  updateRoom,
} from '../../api/aula-api.js';
import { escapeHtml, pageHeader } from '../../utils/html.js';
import { table } from '../../components/table.js';

function roomForm(editing = null) {
  return `
    <form id="room-form" class="form-grid">
      <input type="hidden" name="id" value="${escapeHtml(editing?.id || '')}" />

      <label>
        Número de sala
        <input name="numero" required maxlength="20" value="${escapeHtml(editing?.numero || '')}" />
      </label>

      <label>
        Piso
        <input name="piso" type="number" min="0" max="30" required value="${escapeHtml(editing?.piso ?? 1)}" />
      </label>

      <label>
        Edificio
        <input name="edificio" required maxlength="100" placeholder="Ej. Hucke" value="${escapeHtml(editing?.edificio || '')}" />
      </label>

      <label>
        Dirección
        <input name="direccion" required maxlength="120" placeholder="Ej. General Cruz 222" value="${escapeHtml(editing?.direccion || '')}" />
      </label>

      <div class="form-actions">
        <button type="submit">${editing ? 'Guardar cambios' : 'Agregar sala'}</button>
        ${editing ? '<button type="button" class="secondary" data-action="cancel-edit">Cancelar</button>' : ''}
      </div>
    </form>
  `;
}

export async function renderRoomManagementPage(container, context) {
  container.innerHTML = `
    ${pageHeader(
      'Administración',
      'Gestionar salas',
      'Agrega, edita o elimina las salas disponibles en el sistema.',
    )}
    <div id="room-management"><div class="loading">Cargando salas…</div></div>
  `;

  const section = container.querySelector('#room-management');
  let rooms = [];
  let editingId = null;

  async function loadRooms() {
    try {
      rooms = await getRooms();
      render();
    } catch (error) {
      section.innerHTML = `
        <section class="error-box" role="alert">
          <h2>No se pudo cargar la gestión de salas</h2>
          <p>${error.message}</p>
        </section>
      `;
    }
  }

  function render() {
    const editing = rooms.find((room) => room.id === editingId) || null;
    const rows = rooms.map(
      (room) => `
        <tr>
          <td><strong>${escapeHtml(room.edificio)}</strong><small>${escapeHtml(room.direccion)}</small></td>
          <td>Sala ${escapeHtml(room.numero)}<small>Piso ${escapeHtml(room.piso)}</small></td>
          <td>
            <div class="table-actions">
              <button type="button" class="secondary" data-action="edit" data-id="${escapeHtml(room.id)}">Editar</button>
              <button type="button" class="danger" data-action="delete" data-id="${escapeHtml(room.id)}">Eliminar</button>
            </div>
          </td>
        </tr>
      `,
    );

    section.innerHTML = `
      <section class="form-section">
        <h2>${editing ? 'Editar sala' : 'Agregar sala'}</h2>
        ${roomForm(editing)}
      </section>

      <section class="section">
        <h2>Salas registradas</h2>
        ${rooms.length ? table(['Edificio', 'Sala', 'Acciones'], rows) : '<div class="empty"><p>No hay salas registradas.</p></div>'}
      </section>
    `;

    bindEvents();
  }

  function bindEvents() {
    const form = section.querySelector('#room-form');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const id = String(formData.get('id') || '');
      const data = {
        numero: String(formData.get('numero') || '').trim(),
        piso: Number(formData.get('piso')),
        edificio: String(formData.get('edificio') || '').trim(),
        direccion: String(formData.get('direccion') || '').trim(),
      };

      try {
        if (id) {
          await updateRoom(id, data);
          context.notify('Cambios guardados correctamente.');
        } else {
          await createRoom(data);
          context.notify('Sala guardada correctamente.');
        }

        editingId = null;
        await loadRooms();
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
        const room = rooms.find((item) => item.id === button.dataset.id);
        if (!room || !window.confirm(`¿Eliminar la sala ${room.numero}?`)) return;

        try {
          await deleteRoom(room.id);
          context.notify('Sala eliminada.');
          editingId = null;
          await loadRooms();
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

  await loadRooms();
}
