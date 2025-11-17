# 🇵🇪 Proyect_Peru_Zone

Este proyecto es una aplicación web full-stack diseñada para **gestionar información turística y geográfica de las regiones del Perú**, ofreciendo una interfaz moderna y una API robusta para manejar los datos.

---

## 🛠️ Pila Tecnológica

La aplicación se desarrolla utilizando una pila de tecnologías moderna y robusta.

### 💻 Backend (API)

El backend expone una API RESTful para manejar la lógica de negocio, la persistencia de datos y la seguridad.

| Componente | Detalle |
| :--- | :--- |
| **Lenguaje** | C# |
| **Framework** | .NET Core 7.0 |
| **Arquitectura** | API RESTful (Controladores API) |
| **Base de Datos** | **SQL Server LocalDB** (para desarrollo con EF Core) |

### 🖼️ Frontend (Cliente)

El frontend es una Single Page Application (SPA) que consume la API del backend para presentar la interfaz de usuario.

| Componente | Detalle |
| :--- | :--- |
| **Librería** | React |
| **Build Tool** | **Vite** |
| **Gestor de Paquetes** | npm |

---

## 🚀 Guía de Instalación y Ejecución

Sigue estos pasos para poner en marcha el proyecto en tu entorno local.

### 1. Prerrequisitos

Asegúrate de tener instalado lo siguiente:

* **.NET SDK 7.0** (O superior, preferiblemente 8.0)
* **Node.js (v20+ o v24.x)**
* **Visual Studio 2022**

### 2. Configuración del Backend (`./backend/`)

1.  Navega al directorio del backend:
    ```bash
    cd backend
    ```
2.  Abre el archivo de solución (`Sln_Backend.sln`) en Visual Studio 2022.
3.  **Configuración de Conexión:**
    * La API corre en el puerto **`http://localhost:5062`**.
    * **CORS** está configurado en `Program.cs` para aceptar peticiones desde `http://localhost:5173`.
4.  **Ejecutar Migraciones (EF Core):** Si has creado los modelos y el `DbContext`, crea la base de datos:
    ```bash
    # Asegúrate de estar en el directorio de la solución o del proyecto Proy_Backend
    dotnet ef database update --project Proy_Backend
    ```
5.  **Ejecuta el proyecto:**
    * Inicia el proyecto **`Proj_Backend`** desde Visual Studio 2022 (usando el perfil **`http`**).

### 3. Configuración del Frontend (`./frontend/`)

1.  Navega al directorio del frontend:
    ```bash
    cd frontend
    ```
2.  Instala todas las dependencias necesarias:
    ```bash
    npm install
    ```
3.  **Proxy:** El archivo `vite.config.js` está configurado para usar un proxy que redirige todas las llamadas `/api` a `http://localhost:5062`.
4.  **Inicia la aplicación cliente:**
    ```bash
    npm run dev
    ```
    El frontend debería abrirse automáticamente en tu navegador (usualmente en `http://localhost:5173`).

---

## 🗺️ Estructura del Proyecto

* `./backend/`: Código fuente de C#/.NET Core.
    * `./Controllers/`: Puntos de entrada de la API (ej: `TestController.cs`).
    * `./Models/`: Estructuras de datos (ej: `Region.cs`).
    * `./Data/`: Contexto de la base de datos (`ApplicationDbContext.cs`).
* `./frontend/`: Código fuente de React.
    * `./src/components/`: Componentes reutilizables.
    * `./src/pages/`: Vistas principales de la aplicación.
    * `./src/services/`: Funciones para interactuar con la API.

### 🔗 Prueba de Conexión (Endpoint de Validación)

Una vez que ambos servidores estén corriendo, el componente `App.jsx` realiza un `fetch` a la siguiente ruta para verificar el estado:

`GET /api/Test/test`

Si la conexión es exitosa, se mostrará el mensaje "Backend Respondió: ¡Conexión exitosa desde el Backend!".