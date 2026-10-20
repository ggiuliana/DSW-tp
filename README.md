# TP DSW
## Integrantes
* 54280 - Squarzon, José Nicolás 
* 54448 - Grieco, Giuliana 
* 55160 - Corbella, Leonardo Gabriel
---
# Serene Paws - Sistema de Gestión Veterinaria 

Sistema web integral para la administración de clínicas veterinarias, gestión de turnos, historias clínicas e inventario de vacunas y estudios. Desarrollado con arquitectura en capas utilizando Node.js (Backend) y React (Frontend).

## Descripción del Sistema
El Sistema de Gestión Veterinaria (SGV) registra y administra las actividades clínicas y operativas de la clínica en torno a las entidades principales de Dueños, Mascotas, Veterinarios y Turnos.

Tanto los Dueños como los Veterinarios tienen datos en común, tales como DNI, Nombre, Apellido, Dirección, Teléfono y Email, entre otros.

Las Mascotas pertenecen a un único Dueño y tienen características propias como Especie, Raza y Fecha de Nacimiento. Su historial clínico se conforma mediante la aplicación de Vacunas (ingresadas por el Dueño al momento de registro de la Mascota) y la realización de Estudios y Consultas.

El acceso a las distintas funcionalidades está restringido mediante Roles (Administrador/Recepcionista, Veterinario y Dueño). Estos roles se definen en un Grupo de permisos, los cuales contienen los Permisos definidos para cada tipo de usuario.

Cada Usuario tiene acceso a diferentes funcionalidades del sistema mediante un Módulo de Acceso que le da permisos a realizar diferentes acciones en el programa. 

Para la atención, la clínica gestiona Turnos, donde se asocia una Mascota con un Turno, cargado por un Veterinario y asociado con él en una fecha y hora específicas. El Dueño de la Mascota selecciona un Turno de los turnos disponibles, previamente cargados por el Veterinario, y se lo asigna a su Mascota. 

Al momento de que el Veterinario crea sus Turnos los mismo tienen el estado “Pendiente". Cuando un turno es asignado a una Mascota su estado se convierte en “Confirmado”. Llegado el día y la hora del Turno su estado pasa a ser “Resuelto” y se crea la Consulta si la Mascota asistió.

Al concretarse la atención clínica, el Veterinario debe registrar la Consulta en el sistema. En este acto, el Veterinario detalla el diagnóstico, el tratamiento, el peso registrado y los Estudios realizados.

## Documentación del Proyecto

Toda la documentación requerida para la regularidad y aprobación de la materia se encuentra centralizada en el directorio `docs`.

**[Ir al Índice de Documentación (docs/README.md)](./docs/README.md)**

---
*Trabajo Práctico Integrador - Desarrollo de Software*