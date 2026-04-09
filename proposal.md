# Propuesta TP DSW

## Grupo
### Integrantes
* 54280 - Squarzon, Nicolás José
* 54448 - Grieco, Giuliana
* 55160 - Corbella, Leonardo Gabriel

### Repositorios
* [fullstack app]([http://hyperlinkToGihubOrGitlab](https://github.com/ggiuliana/DSW-tp](https://github.com/ggiuliana/DSW-tp))

## Tema
### Descripción
El sistema está orientado a una veterinaria, en donde existen 3 tipos de usuario: el Dueño de la mascota, el Veterinario y el Administrador del sistema. El dueño puede sacar un turno para su mascota en la agenda virtual para una fecha y hora disponibles para un veterinario dado. El veterinario, luego de haberse completado el turno, completa la resolución del mismo, con su diagnóstico, los estudios realizados y otros detalles. El Dueño de la mascota puede cancelar o modificar el turno antes de llegado el momento del mismo.
Además, la veterinaria posee un control de stock de los medicamentos a los que se les administra a las mascotas atendidas. Al quedar pocas unidades de un medicamento, el sistema lo detecta y realiza automáticamente un pedido de reposición al proovedor designado para ese medicamento.

### Modelo
![modeloVet](https://github.com/user-attachments/assets/ecd1134f-3db9-4444-94e8-944136cdb814)

## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Veterinario<br>2. CRUD Dueño<br>3. CRUD Tipo Vacuna<br>4. CRUD Estudio|
|CRUD dependiente|1. CRUD Mascota {depende de} CRUD Dueño<br>2. CRUD Vacuna {depende de} CRUD Tipo Vacuna|
|Listado<br>+<br>detalle| 1. Listado de historia clínica por mascota, con detalle de estudios y vacunas realizadas al animal<br> 2. Listado de turnos otorgados por veterinario en un rango de fechas determinado.
|CUU/Epic|1. Agendar turno con recordatorio<br>2. Registrar resolución de turno junto a los estudios realizados|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Veterinario<br>2. CRUD Dueño<br>3. CRUD Tipo Vacuna<br>4. CRUD Vacuna<br>5. CRUD Estudio<br>6. CRUD Medicamento<br>7. CRUD Proveedor|
|CUU/Epic|1. Agendar turno con recordatorio<br>2. Registrar resolución de turno junto a los estudios realizados<br>3. Realizar pedido automático de medicamentos con poco o sin stock a proovedor|

