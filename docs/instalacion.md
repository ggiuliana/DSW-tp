# Instrucciones de Instalación y Ejecución

El proyecto está dividido en dos aplicaciones agnósticas: un **Backend** (Node.js + Express + MikroORM) y un **Frontend** (React + Vite + TailwindCSS).

## Prerrequisitos
- [Node.js](https://nodejs.org/) (v18 o superior)
- Gestor de paquetes: `pnpm` 
- Docker
---
## 1. Creación del Contenedor en Docker
1. **Colocar el siguiente comando en la terminal**
- Para Windows
```bash
docker run --name veterinaria-db -v "C:\Users\User\docker-volumes\ps8-dsw-h4g:/var/lib/mysql" -e MYSQL_ROOT_HOST="%" -e MYSQL_ALLOW_EMPTY_PASSWORD="yes" -e MYSQL_PASSWORD="vet" -e MYSQL_USER="vet" -e MYSQL_DATABASE="veterinaria" -p 3307:3306 -d percona/percona-server
```
- Para Linux
```bash 
docker run --name veterinaria-db -v /c/Users/User/docker-volumes/ps8-dsw-h4g:/var/lib/MySQL -e MYSQL_ROOT_HOST='%' -e MYSQL_ALLOW_EMPTY_PASSWORD="yes" -e MYSQL_PASSWORD="vet" -e MYSQL_USER="vet" -e MYSQL_DATABASE='veterinaria' -p 3307:3306 -d percona/percona-server
```
 
## 2. Configuración del Backend

1. **Navegar al directorio del backend:**
   ```bash
   cd backend
   ```

2. **Instalar las dependencias:**
   ```bash
   pnpm install
   ```

3. **Compilar el código de :**
   ```bash
   pnpm tsc
   ```
4. **Levantar el servidor de backend**
    ```bash
    node dist/app.js
    ```
Si el servidor levantó correctamente  debería aparecer el siguiente mensaje:  
*El servidor estará corriendo en `http://localhost:3000`*

---
## 2. Configuración del Frontend

1. **Navegar al directorio del frontend:**
   Desde la raíz del proyecto:
   ```bash
   cd frontend
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

3. **Iniciar la aplicación en modo desarrollo:**
   ```bash
   pnpm run dev
   ```
Si la aplicación se inició correctamente debería aparecer el siguiente mensaje:

*La aplicación estará disponible en `http://localhost:5173`*

## Usuarios de Prueba
Una vez ejecutados los seeders en el backend, se puede ingresar con los siguientes usuarios de prueba:
- **Admin:** Usuario:`admin` / Contraseña: `admin123`
- **Veterinario:** `vet1` / Contraseña: `vet123`
- **Dueño:** ` ` / Contraseña: ` `