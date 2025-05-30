# Todo List App - Prueba Técnica

Una aplicación web completa de gestión de tareas con autenticación JWT, subtareas jerárquicas y sistema de comentarios.

## 🎯 Características Principales

- ✅ **Autenticación completa**: Registro, login, logout con JWT
- ✅ **CRUD de tareas**: Crear, editar, eliminar y marcar como completadas
- ✅ **Sistema de subtareas**: Jerarquía padre-hijo con lógica de dependencia
- ✅ **Comentarios**: Sistema completo de comentarios en tareas
- ✅ **Filtrado avanzado**: Por estado con contadores dinámicos
- ✅ **Diseño responsivo**: Mobile-first, optimizado para todos los dispositivos
- ✅ **UX optimizada**: Estados de loading, optimistic updates, toast notifications

## 🛠️ Stack Tecnológico

### Frontend

- **Framework**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS + Design System personalizado
- **Estado**: React Context API + Custom Hooks
- **Forms**: react-hook-form con validaciones
- **HTTP Client**: Axios con interceptors
- **Notificaciones**: react-hot-toast
- **Fechas**: date-fns con localización en español

### Backend

- **Runtime**: Node.js v23.10.0
- **Framework**: Express.js
- **Base de datos**: MongoDB Atlas (remoto)
- **ODM**: Mongoose
- **Autenticación**: JWT + bcryptjs
- **Validaciones**: express-validator

## 📋 Prerrequisitos

- **Node.js**: v18.0.0 o superior (recomendado: v23.10.0)
- **npm**: v8.0.0 o superior (recomendado: v10.9.2)
- **Git**: Para clonar el repositorio

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd todo-list-app
```

### 2. Configurar MongoDB Atlas

#### ⚡ Configuración Automática

**¡No necesitas crear tablas manualmente!** Mongoose se encarga de todo automáticamente:

- ✅ **Base de datos**: Se crea automáticamente al especificar el nombre en la URI
- ✅ **Collections (tablas)**: Se crean automáticamente desde los models (users, tasks, comments)
- ✅ **Índices**: Se aplican automáticamente según los schemas definidos
- ✅ **Estructura**: Toda la estructura se genera al iniciar la aplicación

#### 🔧 Pasos para MongoDB Atlas:

1. **Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)** (gratis)
2. **Crear nuevo cluster** (seleccionar tier gratuito M0)
3. **Configurar Database User**:
   - Username: tu-usuario
   - Password: tu-password-seguro
4. **Configurar Network Access**:
   - Add IP Address → Allow access from anywhere (0.0.0.0/0) para desarrollo
5. **Obtener Connection String**:
   - Connect → Connect your application → Copy connection string
   - Formato: `mongodb+srv://username:password@cluster.mongodb.net/`

### 3. Configurar el Backend

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env
```

**Editar `backend/.env` con tus credenciales:**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todolistdb?retryWrites=true&w=majority
JWT_SECRET=tu-super-secreto-jwt-key-2024-todolist
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### 3. Configurar el Frontend

```bash
# Navegar a la carpeta frontend (desde la raíz)
cd frontend

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.local.example .env.local
```

**Editar `frontend/.env.local`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 5. Verificar Configuración de Base de Datos

**Al ejecutar la aplicación por primera vez**:

1. Mongoose conectará automáticamente a MongoDB Atlas
2. Creará la base de datos `todolistdb` si no existe
3. Creará las siguientes collections automáticamente:
   - `users` (datos de usuarios)
   - `tasks` (tareas principales y subtareas)
   - `comments` (comentarios en tareas)
4. Aplicará todos los índices necesarios (email único, etc.)

**Verificación exitosa**: En los logs del backend verás:

```
MongoDB Connected: tu-cluster.xxxxx.mongodb.net
Server running on port 5000
```

## 🎮 Ejecutar la Aplicación

### Opción A: Ejecutar ambos servidores por separado

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

✅ Servidor backend corriendo en `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

✅ Aplicación web disponible en `http://localhost:3000`

### Opción B: Scripts de desarrollo (si están configurados)

```bash
# Desde la raíz del proyecto
npm run dev:backend    # Terminal 1
npm run dev:frontend   # Terminal 2
```

## 👤 Usuarios Demo

### Crear Usuario de Prueba

1. Ve a `http://localhost:3000/register`
2. Registra un nuevo usuario con:
   - **Nombre**: Tu nombre
   - **Email**: tu@email.com
   - **Password**: Password123 (mínimo 6 caracteres, 1 mayúscula, 1 minúscula, 1 número)

### Usuario Demo Existente (si aplica)

```
Email: demo@todoapp.com
Password: Demo123456
```

## 📖 Guía de Uso

### 1. Autenticación

- **Registro**: Crear cuenta nueva en `/register`
- **Login**: Iniciar sesión en `/login`
- **Logout**: Botón en la esquina superior derecha

### 2. Gestión de Tareas

- **Crear tarea**: Botón "Nueva Tarea" en dashboard
- **Editar**: Click en botón "Editar" de cualquier tarea
- **Eliminar**: Click en "Eliminar" + confirmar en modal
- **Cambiar estado**: Click en checkbox de la tarea

### 3. Subtareas

- **Crear subtarea**: Click en "Subtarea" en tarea padre
- **Lógica de dependencia**: Tarea padre no se puede completar si tiene subtareas pendientes
- **Jerarquía visual**: Subtareas aparecen indentadas bajo su padre

### 4. Comentarios

- **Ver comentarios**: Click en "Comentarios" en cualquier tarea
- **Crear**: Formulario rápido en modal de comentarios
- **Editar/Eliminar**: Solo comentarios propios

### 5. Filtros

- **Por estado**: Todas, Pendientes, Completadas
- **Incluir subtareas**: Toggle para mostrar/ocultar subtareas
- **Contadores dinámicos**: Actualizados en tiempo real

## 🏗️ Estructura del Proyecto

```
todo-list-app/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuración de BD
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middleware/     # Autenticación, validaciones
│   │   ├── models/         # Modelos de Mongoose
│   │   ├── routes/         # Rutas de API
│   │   └── utils/          # Utilidades
│   ├── .env.example        # Variables de entorno ejemplo
│   ├── package.json
│   └── server.js           # Servidor principal
│
├── frontend/
│   ├── src/
│   │   ├── app/            # Páginas (App Router)
│   │   ├── components/     # Componentes React
│   │   ├── contexts/       # Context API
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # APIs y servicios
│   │   ├── types/          # Interfaces TypeScript
│   │   └── utils/          # Utilidades
│   ├── .env.local.example  # Variables de entorno ejemplo
│   └── package.json
│
├── README.md               # Este archivo
└── .gitignore
```

## 🔌 API Endpoints

### Autenticación

```
POST   /api/auth/register    # Registro de usuario
POST   /api/auth/login       # Inicio de sesión
GET    /api/auth/me          # Perfil del usuario
GET    /api/auth/validate    # Validar token
```

### Tareas

```
GET    /api/tasks            # Listar tareas del usuario
POST   /api/tasks            # Crear nueva tarea
GET    /api/tasks/:id        # Obtener tarea específica
PUT    /api/tasks/:id        # Actualizar tarea
DELETE /api/tasks/:id        # Eliminar tarea
PUT    /api/tasks/:id/status # Cambiar estado de tarea
```

### Subtareas

```
GET    /api/tasks/:id/subtasks     # Obtener subtareas
POST   /api/tasks/:id/subtasks     # Crear subtarea
```

### Comentarios

```
GET    /api/tasks/:taskId/comments    # Comentarios de una tarea
POST   /api/tasks/:taskId/comments    # Crear comentario
PUT    /api/comments/:id             # Actualizar comentario
DELETE /api/comments/:id             # Eliminar comentario
```

## 🧪 Testing

### Testing Manual

```bash
# Asegurar que ambos servidores estén corriendo
# Frontend: http://localhost:3000
# Backend: http://localhost:5000

# Probar flujo completo:
# 1. Registro/Login
# 2. CRUD de tareas
# 3. Subtareas y dependencias
# 4. Comentarios
# 5. Filtros
```

### Performance Testing

```bash
# Build de producción
cd frontend
npm run build

# Lighthouse audit en Chrome DevTools
# Scores objetivo: Performance 70+, Accessibility 85+
```

## 🔧 Comandos Útiles

### Backend

```bash
npm run dev          # Desarrollo con nodemon
npm start           # Producción
npm run lint        # ESLint (si configurado)
```

### Frontend

```bash
npm run dev         # Desarrollo con hot reload
npm run build       # Build de producción
npm run start       # Servidor de producción
npm run lint        # ESLint
npm run type-check  # Verificación TypeScript
```

## 🐛 Solución de Problemas

### Errores Comunes

**Backend no conecta a MongoDB:**

```bash
# Verificar variables de entorno
cat backend/.env

# Verificar conectividad de red
ping tu-cluster.xxxxx.mongodb.net

# Verificar logs del backend para errores específicos
cd backend && npm run dev
# Buscar mensajes como "MongoDB Connected" o errores de conexión
```

**Errores comunes de MongoDB Atlas:**

- **Credenciales incorrectas**: Verificar username/password en la URI
- **Network Access**: Asegurar que tu IP esté permitida (0.0.0.0/0 para desarrollo)
- **Cluster pausado**: Clusters gratuitos se pausan por inactividad, se reactivan automáticamente
- **URI malformada**: Verificar formato correcto con mongodb+srv://

**Base de datos vacía inicialmente**:

- Es normal que MongoDB Atlas muestre 0 documents inicialmente
- Las collections se crean automáticamente al insertar el primer documento
- Registra el primer usuario para verificar que la conexión funciona

**Frontend no conecta al backend:**

```bash
# Verificar que backend esté corriendo en puerto 5000
curl http://localhost:5000/api/health
# Verificar variables de entorno del frontend
cat frontend/.env.local
```

**Errores de CORS:**

- Verificar que `NEXT_PUBLIC_API_URL` apunte a `http://localhost:5000/api`
- Backend tiene CORS configurado para desarrollo

**Token JWT inválido:**

- Verificar que `JWT_SECRET` sea consistente
- Limpiar localStorage del navegador: `localStorage.clear()`

### Logs de Debug

```bash
# Backend logs
cd backend && npm run dev
# Ver logs en consola

# Frontend logs
cd frontend && npm run dev
# Ver errores en browser console (F12)
```

## 🚀 Deployment (Notas para Producción)

### Backend

- Configurar variables de entorno de producción
- Usar MongoDB Atlas con IP whitelist apropiad
- Configurar CORS para dominio de producción
- Usar PM2 o similar para process management

### Frontend

- Build optimizado: `npm run build`
- Servir desde CDN o servidor estático
- Configurar `NEXT_PUBLIC_API_URL` para API de producción

## 📝 Características Implementadas

### ✅ Requerimientos MVP

- [x] Autenticación JWT completa
- [x] CRUD de tareas básico
- [x] Cambio de estado (pendiente/completada)
- [x] Filtrado por estado
- [x] Diseño responsivo
- [x] Documentación completa

### ✅ Características Avanzadas

- [x] Sistema de subtareas con dependencias
- [x] Comentarios en tareas (CRUD completo)
- [x] Jerarquía visual de tareas padre-hijo
- [x] Contadores dinámicos
- [x] Optimistic updates para UX fluida
- [x] Estados de loading granulares
- [x] Toast notifications
- [x] Responsive design mobile-first

### ✅ Calidad Técnica

- [x] TypeScript completo con type safety
- [x] Componentes modulares y reutilizables
- [x] Custom hooks para lógica compartida
- [x] Error handling en múltiples capas
- [x] Performance optimizada con React.memo
- [x] Code splitting y bundle optimization

## 📊 Métricas de Calidad

### Performance (Lighthouse)

- **Performance**: 78/100 (muy bueno)
- **Accessibility**: 87/100 (muy bueno)
- **Best Practices**: 100/100 (perfecto)
- **SEO**: 100/100 (perfecto)

### Bundle Size

- **Shared chunks**: 101 kB
- **Dashboard page**: 153 kB total
- **Auth pages**: 139 kB total

## 👥 Desarrolladores

Desarrollado como prueba técnica.

**Stack de desarrollo:**

- Debugging sistemático
- Testing manual exhaustivo
- Documentación continua

---

## 📞 Soporte

Para preguntas o issues:

1. Verificar esta documentación
2. Revisar logs de backend y frontend
3. Verificar conectividad de red y base de datos
4. Contactar al desarrollador con detalles específicos del error

---

**¡Aplicación lista para evaluación!** ✅
