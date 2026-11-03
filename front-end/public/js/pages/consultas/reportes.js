import { getReports } from '../../api/aula-api.js';
import { escapeHtml, pageHeader } from '../../utils/html.js';
import { table } from '../../components/table.js';

export async function renderReportsPage(container) {
  container.innerHTML = `
    ${pageHeader(
      'Consultas',
      'Uso de salas',
      'Resumen semanal de ocupación y horas asignadas por sala.',
    )}
    <div id="report-content"><div class="loading">Cargando consulta…</div></div>
  `;

  const content = container.querySelector('#report-content');

  try {
    const rows = await getReports();
    const totalBlocks = rows.reduce((sum, row) => sum + Number(row.clases || 0), 0);
    const usedRooms = rows.filter((row) => Number(row.clases || 0) > 0).length;

    const tableRows = rows.map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.edificio)}</td>
          <td>Sala ${escapeHtml(row.numero)}<small>Piso ${escapeHtml(row.piso)}</small></td>
          <td>${escapeHtml(row.clases)}</td>
          <td>${(Number(row.minutos || 0) / 60).toLocaleString('es-CL', { maximumFractionDigits: 2 })} h</td>
        </tr>
      `,
    );

    content.innerHTML = `
      <div class="stats">
        <article class="stat-card">
          <strong>${totalBlocks}</strong>
          <span>Bloques de clase registrados</span>
        </article>
        <article class="stat-card">
          <strong>${usedRooms}</strong>
          <span>Salas con uso durante la semana</span>
        </article>
      </div>

      <section class="section">
        ${table(['Edificio', 'Sala', 'Bloques semanales', 'Horas asignadas'], tableRows)}
      </section>
    `;
  } catch (error) {
    content.innerHTML = `
      <section class="error-box" role="alert">
        <h2>No se pudo ejecutar la consulta</h2>
        <p>${error.message}</p>
      </section>
    `;
  }
}
