const STORAGE_KEY = 'aula-uv-horario';

export function getSavedClassIds() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(saved) ? saved.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function toggleSavedClass(id) {
  const current = getSavedClassIds();
  const next = current.includes(id)
    ? current.filter((savedId) => savedId !== id)
    : [...current, id];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function removeMissingSavedClasses(validIds) {
  const cleaned = getSavedClassIds().filter((id) => validIds.includes(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
  return cleaned;
}
