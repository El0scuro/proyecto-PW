import { escapeHtml } from '../utils/html.js';

export function classCard(classItem, savedIds = []) {
  const saved = savedIds.includes(classItem.id);
  const room = classItem.sala ?? {};

  return `
    <article class="card">
      <div class="card-top">
        ${classItem.codigo ? `<span class="code">${escapeHtml(classItem.codigo)}</span>` : '<span></span>'}
        <span class="badge">Sección ${escapeHtml(classItem.seccion)}</span>
      </div>

      <h3>${escapeHtml(classItem.asignatura)}</h3>
      <p class="card-subtitle">${escapeHtml(classItem.profesor)}</p>

      <div class="card-meta">
        <span><strong>${escapeHtml(classItem.dia)}</strong> · ${escapeHtml(classItem.inicio)}–${escapeHtml(classItem.fin)}</span>
        <span>${escapeHtml(room.edificio || 'Edificio sin informar')} · Sala ${escapeHtml(room.numero || '—')} · Piso ${escapeHtml(room.piso ?? '—')}</span>
      </div>

      <div class="card-actions">
        <button
          type="button"
          class="${saved ? 'secondary' : ''}"
          data-action="guardar-clase"
          data-id="${escapeHtml(classItem.id)}"
        >
          ${saved ? 'Quitar de mi horario' : 'Agregar a mi horario'}
        </button>
      </div>
    </article>
  `;
}
