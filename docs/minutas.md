# Minutas de Reunión y Avance

Registro de las reuniones de sincronización del equipo, decisiones clave de arquitectura y distribución de tareas.

---
### Reunión #1: Definición del Modelo de Negocio
* **Fecha:** 31/03/2026
* **Asistentes:** Giuliana, Nicolas, Leonardo
* **Temas tratados:**
  - Elección de la temática del proyecto (Sistema de Gestión Veterinaria).
* **Acciones:**
  - Creación repositorio inicial.
  - Planteo el Modelo de Datos inicial (Boceto).
---
### Reunión #2: Creación de Propuesta inicial
* **Fecha:** Semana del 06/04/2026
* **Asistentes:** Giuliana, Nicolas, Leonardo
* **Temas tratados:**
  - Creación inicial de la `proposal.md` y definición de actores (Admin, Veterinario, Dueño) y entidades principales.
  - Revisión del Diagrama Entidad-Relación (`modeloVete.png`).
  - Planteo del alcance del proyecto.
* **Acciones:**
  - Redacción de la propuesta.
  - Finalización del Modelo de Datos.
---
### Reunión #3: Base de Datos
* **Fecha:** 23/06/2026
* **Asistentes:** Giuliana, Nicolas, Leonardo
* **Temas tratados:**
  - Discusión sobre la Base de Datos.
  - Elección de la tecnología MicroORM.
* **Acciones:**
  - Creación de la Base de Datos.
---
### Reunión #4 Backend
* **Fecha:** Durante el mes de Julio
* **Asistentes:** Giuliana, Nicolas, Leonardo
* **Temas tratados:**
  - Definición y desarrollo de algunas CRUDs en el backend.
* **Acciones:**
  - Creación de las CRUDs de Dueño (Persona) y Mascota.
---
### Reunión #5: Frontend y Login
* **Fecha:** Durante el mes de Agosto
* **Asistentes:** Giuliana, Nicolas, Leonardo
* **Temas tratados:**
  - Discusión sobre tecnologías y framework del frontend.
  - Incorporación de la clase usuario con roles.
  - Implementación del Login
* **Acciones:**
  - Creación de las bases del frontend con Tailwind (Panel de Dueño) y las CRUDs de las clases usuario y rol.
  - Implementación del sistema de Login y generación de JWT.
---
### Reunión #6: Desarrollo del Backend
* **Fecha:** Durante el mes de Septiembre
* **Asistentes:** Giuliana, Nicolas, Leonardo
* **Temas tratados:**
  - Discusión sobre  el reemplazo de la clase Rol por las clases Permisos y Grupos de Permisos.
* **Acciones:**
  - Implementación de las CRUDs Permiso y Grupo de Permisos, 
  - Centralización de errores mediante Middleware.
---
### Reunión #6: Desarrollo del Backend
* **Fecha:** Durante el mes de Octubre
* **Asistentes:** Giuliana, Nicolas, Leonardo
* **Temas tratados:**
  - Discusión sobre la arquitectura del proyecto.
  - Discusión sobre la distribución de tareas para cumplir con los requisitos necesarios para la entrega de regularidad.
* **Acciones:**
  - Creación de CRUDs faltantes (Vacuna, Proveedor, Turno, Consulta).
  - Refactorización del Frontend para usar una estructura más limpia.
  - Implementación de los casos de uso del sistema.