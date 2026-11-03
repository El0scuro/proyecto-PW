export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[character];
  });
}

export function optionList(items, selected = '', placeholder = null) {
  const options = [];

  if (placeholder !== null) {
    options.push(`<option value="">${escapeHtml(placeholder)}</option>`);
  }

  for (const item of items) {
    const [value, label] = Array.isArray(item) ? item : [item, item];
    const isSelected = String(value) === String(selected) ? 'selected' : '';

    options.push(
      `<option value="${escapeHtml(value)}" ${isSelected}>${escapeHtml(label)}</option>`,
    );
  }

  return options.join('');
}

export function pageHeader(kicker, title, description) {
  return `
    <header class="page-header">
      <div>
        <p class="page-kicker">${escapeHtml(kicker)}</p>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(description)}</p>
      </div>
    </header>
  `;
}

export function emptyState(title, description) {
  return `
    <section class="empty">
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(description)}</p>
    </section>
  `;
}
