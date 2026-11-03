'use client';

import { useEffect, useMemo, useState } from 'react';
import { aulaApi } from '@/lib/api';
import type { ClassBlock, Room, Session } from '@/lib/types';
import DashboardShell from './DashboardShell';

const nav = [
  { id: 'buscar', label: 'Buscar clase' },
  { id: 'horario', label: 'Mi horario' },
  { id: 'salas', label: 'Salas y edificios' },
];

export default function StudentDashboard({ session }: { session: Session }) {
  const [active, setActive] = useState('buscar');
  const [query, setQuery] = useState('');
  const [day, setDay] = useState('');
  const [classes, setClasses] = useState<ClassBlock[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [classRows, roomRows] = await Promise.all([
          aulaApi.clases(),
          aulaApi.salas(),
        ]);
        setClasses(classRows);
        setRooms(roomRows);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'No se pudo cargar la información.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filtered = useMemo(() => {
    return classes.filter((item) => {
      const text = `${item.codigo} ${item.asignatura} ${item.profesor}`.toLowerCase();
      const matchesText = !query || text.includes(query.toLowerCase());
      const matchesDay = !day || item.dia === day;
      return matchesText && matchesDay;
    });
  }, [classes, query, day]);

  function toggleSavedClass(classId: string) {
    setSaved((current) =>
      current.includes(classId)
        ? current.filter((id) => id !== classId)
        : [...current, classId],
    );
  }

  const savedClasses = classes.filter((item) => saved.includes(item.id));

  return (
    <DashboardShell
      session={session}
      nav={nav}
      active={active}
      onNavigate={setActive}
    >
      {error && <div className="notice">{error}</div>}

      {active === 'buscar' && (
        <>
          <PageHeader
            kicker="Estudiante"
            title="Buscar clase"
            text="Busca por asignatura, código o profesor y revisa la sala antes de ir a clases."
          />

          <section className="filter-card">
            <label>
              Asignatura o profesor
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Asignatura, código o profesor"
              />
            </label>

            <label>
              Día
              <select value={day} onChange={(event) => setDay(event.target.value)}>
                <option value="">Todos</option>
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(
                  (item) => (
                    <option key={item}>{item}</option>
                  ),
                )}
              </select>
            </label>
          </section>

          {loading ? (
            <EmptyState text="Cargando clases…" />
          ) : filtered.length === 0 ? (
            <EmptyState text="No hay clases para mostrar." />
          ) : (
            <>
              <div className="result-line">
                <strong>
                  {filtered.length}{' '}
                  {filtered.length === 1 ? 'clase encontrada' : 'clases encontradas'}
                </strong>
              </div>

              <div className="cards-grid">
                {filtered.map((item) => (
                  <article className="class-card" key={item.id}>
                    <div className="card-top">
                      <span className="code">{item.codigo}</span>
                      <span className="pill">Sección {item.seccion}</span>
                    </div>
                    <h3>{item.asignatura}</h3>
                    <p>{item.profesor}</p>
                    <div className="class-meta">
                      <span>{item.dia}</span>
                      <span>{item.inicio}–{item.fin}</span>
                    </div>
                    <div className="room-box">
                      <strong>{item.sala.edificio}</strong>
                      <span>Sala {item.sala.numero} · Piso {item.sala.piso}</span>
                    </div>
                    <button
                      className="primary"
                      onClick={() => toggleSavedClass(item.id)}
                    >
                      {saved.includes(item.id)
                        ? 'Quitar de mi horario'
                        : 'Guardar en mi horario'}
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {active === 'horario' && (
        <>
          <PageHeader
            kicker="Estudiante"
            title="Mi horario"
            text="Clases que guardaste para tenerlas a mano durante la semana."
          />

          {savedClasses.length === 0 ? (
            <EmptyState text="Todavía no has guardado clases en tu horario." />
          ) : (
            <div className="cards-grid">
              {savedClasses.map((item) => (
                <article className="class-card" key={item.id}>
                  <span className="code">{item.dia}</span>
                  <h3>{item.asignatura}</h3>
                  <p>{item.inicio}–{item.fin}</p>
                  <div className="room-box">
                    <strong>{item.sala.edificio}</strong>
                    <span>Sala {item.sala.numero} · Piso {item.sala.piso}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {active === 'salas' && (
        <>
          <PageHeader
            kicker="Directorio"
            title="Salas y edificios"
            text="Consulta el edificio, piso y ubicación de las salas registradas."
          />

          {loading ? (
            <EmptyState text="Cargando salas…" />
          ) : rooms.length === 0 ? (
            <EmptyState text="No hay salas registradas." />
          ) : (
            <div className="cards-grid">
              {rooms.map((room) => (
                <article className="class-card" key={room.id}>
                  <div className="card-top">
                    <span className="code">{room.edificio}</span>
                    <span className="pill">Piso {room.piso}</span>
                  </div>
                  <h3>Sala {room.numero}</h3>
                  <p>{room.direccion}</p>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardShell>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="empty-state">{text}</div>;
}

type PageHeaderProps = {
  kicker: string;
  title: string;
  text: string;
};

function PageHeader({ kicker, title, text }: PageHeaderProps) {
  return (
    <header className="page-header">
      <span className="page-kicker">{kicker}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </header>
  );
}
