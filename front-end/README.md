# Aula UV — Front-end

Front-end desarrollado con **Next.js y TypeScript**.

## Requisitos

- Node.js 20 o superior
- npm

## Ejecutar

```bash
npm install
npm run dev
```

Abrir:

`http://localhost:3000`

## Accesos del prototipo

### Estudiante y Secretaría

El acceso público está en:

`http://localhost:3000`

El sistema reconoce el perfil según la cuenta ingresada.

Cuenta de estudiante para pruebas:


Cuenta de Secretaría para pruebas:


El estudiante puede crear su propia cuenta y debe indicar su generación (año de ingreso).

La Secretaría no se registra desde el login. Su cuenta es creada por Administración.

Estudiantes y Secretaría pueden usar la recuperación de contraseña.

### Administrador

El acceso de Administración está separado del login público. Para desarrollo se utiliza:

`http://localhost:3000/acceso-administrador`

Cuenta local de prueba:


En la implementación con backend, la cuenta administradora debe cargarse al inicializar la base de datos y el servidor debe validar su rol. Ocultar la URL en el front no reemplaza esa validación.


- Estudiante: `estudiante@alumnos.uv.cl` / `aula123`
- Secretaría: `secretaria@uv.cl` / `aula123`
- Administración: `admin@uv.cl` / `aula123` desde `/acceso-administrador`
