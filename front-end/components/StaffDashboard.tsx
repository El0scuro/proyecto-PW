'use client';

import { FormEvent, useEffect, useState } from 'react';
import { aulaApi } from '@/lib/api';
import type {
  ClassBlock,
  Room,
  SecretaryAccount,
  Session,
} from '@/lib/types';
import DashboardShell from './DashboardShell';

type StaffMode = 'secretaria' | 'administrador';

type StaffDashboardProps = {
  session: Session;
  mode: StaffMode;
};

export default function StaffDashboard({ session, mode }: StaffDashboardProps) {
  const nav =
    mode === 'secretaria'
      ? [
          { id: 'clases', label: 'Gestionar clases' },
          { id: 'consultas', label: 'Consultas' },
        ]
      : [
          { id: 'salas', label: 'Gestionar salas' },
          { id: 'clases', label: 'Gestionar clases' },
          { id: 'usuarios', label: 'Cuentas de Secretaría' },
          { id: 'consultas', label: 'Consultas' },
        ];

  const [active, setActive] = useState(nav[0].id);
  const [classRows, setClassRows] = useState<ClassBlock[]>([]);
  const [roomRows, setRoomRows] = useState<Room[]>([]);
  const [secretaryRows, setSecretaryRows] = useState<SecretaryAccount[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [classes, rooms] = await Promise.all([
          aulaApi.clases(),
          aulaApi.salas(),
        ]);

        setClassRows(classes);
        setRoomRows(rooms);

        if (mode === 'administrador') {
          setSecretaryRows(await aulaApi.secretarias());
        }
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar la información del servidor.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [mode]);

  async function addClass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const salaId = String(data.get('salaId') ?? '');
    const sala = roomRows.find((room) => room.id === salaId);

    if (!sala) {
      setMessage('Selecciona una sala registrada.');
      return;
    }

    try {
      const created = await aulaApi.crearClase({
        codigo: String(data.get('codigo') ?? ''),
        asignatura: String(data.get('asignatura') ?? ''),
        seccion: Number(data.get('seccion') ?? 1),
        profesor: String(data.get('profesor') ?? ''),
        dia: String(data.get('dia') ?? ''),
        inicio: String(data.get('inicio') ?? ''),
        fin: String(data.get('fin') ?? ''),
        salaId,
        sala,
      });

      setClassRows((current) => [...current, created]);
      setMessage('Clase guardada correctamente.');
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar la clase.');
    }
  }

  async function deleteClass(id: string) {
    try {
      await aulaApi.eliminarClase(id);
      setClassRows((current) => current.filter((item) => item.id !== id));
      setMessage('Clase eliminada.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo eliminar la clase.');
    }
  }

  async function addRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const created = await aulaApi.crearSala({
        numero: String(data.get('numero') ?? ''),
        piso: Number(data.get('piso') ?? 0),
        edificio: String(data.get('edificio') ?? ''),
        direccion: String(data.get('direccion') ?? ''),
      });

      setRoomRows((current) => [...current, created]);
      setMessage('Sala guardada correctamente.');
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar la sala.');
    }
  }

  async function deleteRoom(id: string) {
    try {
      await aulaApi.eliminarSala(id);
      setRoomRows((current) => current.filter((item) => item.id !== id));
      setMessage('Sala eliminada.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo eliminar la sala.');
    }
  }

  async function addSecretary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const created = await aulaApi.crearSecretaria({
        nombre: String(data.get('nombre') ?? '').trim(),
        correo: String(data.get('correo') ?? '').trim(),
        contrasena: String(data.get('contrasena') ?? ''),
      });

      setSecretaryRows((current) => [...current, created]);
      setMessage('Cuenta de Secretaría creada correctamente.');
      form.reset();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo crear la cuenta de Secretaría.',
      );
    }
  }

  return (
    <DashboardShell
      session={session}
      nav={nav}
      active={active}
      onNavigate={setActive}
    >
      {message && <div className="notice">{message}</div>}

      {active === 'clases' && (
        <ClassManagement
          rows={classRows}
          rooms={roomRows}
          loading={loading}
          onSubmit={addClass}
          onDelete={deleteClass}
        />
      )}

      {active === 'salas' && (
        <RoomManagement
          rows={roomRows}
          loading={loading}
          onSubmit={addRoom}
          onDelete={deleteRoom}
        />
      )}

      {active === 'usuarios' && mode === 'administrador' && (
        <SecretaryManagement
          rows={secretaryRows}
          loading={loading}
          onSubmit={addSecretary}
        />
      )}

      {active === 'consultas' && (
        <Reports classRows={classRows} roomRows={roomRows} loading={loading} />
      )}
    </DashboardShell>
  );
}

type ClassManagementProps = {
  rows: ClassBlock[];
  rooms: Room[];
  loading: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: (id: string) => void;
};

function ClassManagement({
  rows,
  rooms,
  loading,
  onSubmit,
  onDelete,
}: ClassManagementProps) {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  return (
    <>
      <PageHeader
        kicker="Secretaría"
        title="Gestionar clases"
        text="Registra los bloques de clase y la sala asignada."
      />

      <section className="form-section">
        <h2>Agregar clase</h2>
        <form className="form-grid" onSubmit={onSubmit}>
          <label>
            Código
            <input name="codigo" />
          </label>
          <label>
            Asignatura
            <input name="asignatura" required />
          </label>
          <label>
            Sección
            <input name="seccion" type="number" min="1" required />
          </label>
          <label>
            Profesor
            <input name="profesor" required />
          </label>
          <label>
            Día
            <select name="dia" required>
              {days.map((day) => (
                <option key={day}>{day}</option>
              ))}
            </select>
          </label>
          <label>
            Inicio
            <input name="inicio" type="time" required />
          </label>
          <label>
            Término
            <input name="fin" type="time" required />
          </label>
          <label>
            Sala
            <select name="salaId" required defaultValue="">
              <option value="" disabled>
                Selecciona una sala
              </option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.edificio} · Sala {room.numero}
                </option>
              ))}
            </select>
          </label>
          <div className="form-actions">
            <button className="primary" disabled={rooms.length === 0}>
              Agregar clase
            </button>
          </div>
        </form>
      </section>

      <section className="table-section">
        <h2>Clases registradas</h2>
        {loading ? (
          <EmptyState text="Cargando clases…" />
        ) : rows.length === 0 ? (
          <EmptyState text="No hay clases registradas." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Asignatura</th>
                  <th>Horario</th>
                  <th>Sala</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.asignatura}</strong>
                      <small>{item.codigo} · Sección {item.seccion}</small>
                    </td>
                    <td>
                      {item.dia}
                      <small>{item.inicio}–{item.fin}</small>
                    </td>
                    <td>
                      {item.sala.edificio}
                      <small>Sala {item.sala.numero}</small>
                    </td>
                    <td>
                      <button className="danger" onClick={() => onDelete(item.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

type RoomManagementProps = {
  rows: Room[];
  loading: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: (id: string) => void;
};

function RoomManagement({ rows, loading, onSubmit, onDelete }: RoomManagementProps) {
  return (
    <>
      <PageHeader
        kicker="Administración"
        title="Gestionar salas"
        text="Registra o elimina salas disponibles en el sistema."
      />

      <section className="form-section">
        <h2>Agregar sala</h2>
        <form className="form-grid" onSubmit={onSubmit}>
          <label>
            Número de sala
            <input name="numero" required />
          </label>
          <label>
            Piso
            <input name="piso" type="number" min="0" required />
          </label>
          <label>
            Edificio
            <input name="edificio" required />
          </label>
          <label>
            Dirección
            <input name="direccion" required />
          </label>
          <div className="form-actions">
            <button className="primary">Agregar sala</button>
          </div>
        </form>
      </section>

      <section className="table-section">
        <h2>Salas registradas</h2>
        {loading ? (
          <EmptyState text="Cargando salas…" />
        ) : rows.length === 0 ? (
          <EmptyState text="No hay salas registradas." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Edificio</th>
                  <th>Sala</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((room) => (
                  <tr key={room.id}>
                    <td>
                      <strong>{room.edificio}</strong>
                      <small>{room.direccion}</small>
                    </td>
                    <td>
                      Sala {room.numero}
                      <small>Piso {room.piso}</small>
                    </td>
                    <td>
                      <button className="danger" onClick={() => onDelete(room.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

type SecretaryManagementProps = {
  rows: SecretaryAccount[];
  loading: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function SecretaryManagement({ rows, loading, onSubmit }: SecretaryManagementProps) {
  return (
    <>
      <PageHeader
        kicker="Administración"
        title="Cuentas de Secretaría"
        text="Las cuentas de Secretaría son creadas por el administrador del sistema."
      />

      <section className="form-section">
        <h2>Crear cuenta</h2>
        <form className="form-grid" onSubmit={onSubmit}>
          <label>
            Nombre completo
            <input name="nombre" required maxLength={80} />
          </label>
          <label>
            Correo institucional
            <input type="email" name="correo" required placeholder="nombre@uv.cl" />
          </label>
          <label>
            Contraseña temporal
            <input type="password" name="contrasena" required minLength={6} />
          </label>
          <div className="form-actions">
            <button className="primary" type="submit">
              Crear cuenta de Secretaría
            </button>
          </div>
        </form>
      </section>

      <section className="table-section">
        <h2>Secretarías registradas</h2>
        {loading ? (
          <EmptyState text="Cargando cuentas…" />
        ) : rows.length === 0 ? (
          <EmptyState text="No hay cuentas de Secretaría registradas." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((account) => (
                  <tr key={account.correo}>
                    <td>{account.nombre}</td>
                    <td>{account.correo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

type ReportsProps = {
  classRows: ClassBlock[];
  roomRows: Room[];
  loading: boolean;
};

function Reports({ classRows, roomRows, loading }: ReportsProps) {
  return (
    <>
      <PageHeader
        kicker="Consultas"
        title="Uso de salas"
        text="Resumen de ocupación construido con los datos entregados por el backend."
      />

      {loading ? (
        <EmptyState text="Cargando consulta…" />
      ) : (
        <>
          <div className="stats">
            <article>
              <strong>{classRows.length}</strong>
              <span>Bloques registrados</span>
            </article>
            <article>
              <strong>{roomRows.length}</strong>
              <span>Salas registradas</span>
            </article>
          </div>

          {roomRows.length === 0 ? (
            <EmptyState text="No hay datos para mostrar en la consulta." />
          ) : (
            <section className="table-section">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Edificio</th>
                      <th>Sala</th>
                      <th>Bloques</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomRows.map((room) => (
                      <tr key={room.id}>
                        <td>{room.edificio}</td>
                        <td>Sala {room.numero}</td>
                        <td>
                          {classRows.filter((item) => item.salaId === room.id).length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </>
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
