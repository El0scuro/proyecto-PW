import { getRooms } from '../../api/aula-api.js';
import { emptyState, escapeHtml, pageHeader } from '../../utils/html.js';

export async function renderRoomsPage(container) {
  container.innerHTML = `
    ${pageHeader(
      'Directorio',
      'Salas y edificios',
      'Consulta el edificio, piso y dirección de las salas registradas.',
    )}
    <div id="room-list"><div class="loading">Cargando salas…</div></div>
  `;

  const roomList = container.querySelector('#room-list');

  try {
    const rooms = await getRooms();

    roomList.innerHTML = rooms.length
      ? `
        <div class="cards">
          ${rooms
            .map(
              (room) => `
                <article class="card">
                  <div class="card-top">
                    <span class="code">${escapeHtml(room.edificio)}</span>
                    <span class="badge">Piso ${escapeHtml(room.piso)}</span>
                  </div>
                  <h3>Sala ${escapeHtml(room.numero)}</h3>
                  <p class="card-subtitle">${escapeHtml(room.direccion)}</p>
                </article>
              `,
            )
            .join('')}
        </div>
      `
      : emptyState('No hay salas registradas', 'Cuando se agreguen salas aparecerán en este listado.');
  } catch (error) {
    roomList.innerHTML = `
      <section class="error-box" role="alert">
        <h2>No se pudieron cargar las salas</h2>
        <p>${error.message}</p>
      </section>
    `;
  }
}
