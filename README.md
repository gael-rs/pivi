# Pivi - API REST con Node.js y MongoDB

API REST completa desarrollada con Express.js y MongoDB, containerizada con Docker y Docker Compose.

## 🚀 Características

- **API REST completa** con CRUD para todas las entidades
- **MongoDB** como base de datos
- **Express.js** como framework web
- **Docker y Docker Compose** para containerización
- **Arquitectura escalable** con separación de modelos y rutas

## 📋 Requisitos Previos

- Docker
- Docker Compose
- Git

## 🛠️ Instalación

1. Clonar el repositorio:
```bash
git clone <URL_DEL_REPOSITORIO>
cd Pivi
```

2. Construir y levantar los contenedores:
```bash
docker-compose up --build
```

3. La API estará disponible en `http://localhost:3000`

## 📚 Endpoints Disponibles

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener un usuario por ID
- `POST /api/users` - Crear un nuevo usuario
- `PUT /api/users/:id` - Actualizar un usuario
- `DELETE /api/users/:id` - Eliminar un usuario

### Posts
- `GET /api/posts` - Obtener todos los posts
- `GET /api/posts/:id` - Obtener un post por ID
- `GET /api/posts/user/:userId` - Obtener posts de un usuario
- `POST /api/posts` - Crear un nuevo post
- `PUT /api/posts/:id` - Actualizar un post
- `DELETE /api/posts/:id` - Eliminar un post

### Comentarios
- `GET /api/comments` - Obtener todos los comentarios
- `GET /api/comments/:id` - Obtener un comentario por ID
- `GET /api/comments/post/:postId` - Obtener comentarios de un post
- `POST /api/comments` - Crear un nuevo comentario
- `PUT /api/comments/:id` - Actualizar un comentario
- `DELETE /api/comments/:id` - Eliminar un comentario

### Likes
- `GET /api/likes` - Obtener todos los likes
- `GET /api/likes/:id` - Obtener un like por ID
- `GET /api/likes/post/:postId` - Obtener likes de un post
- `GET /api/likes/user/:userId` - Obtener likes de un usuario
- `POST /api/likes` - Dar like a un post
- `DELETE /api/likes/:id` - Quitar like
- `DELETE /api/likes/post/:postId/user/:userId` - Quitar like por post y usuario

### Follows
- `GET /api/follows` - Obtener todos los follows
- `GET /api/follows/:id` - Obtener un follow por ID
- `GET /api/follows/followers/:userId` - Obtener seguidores de un usuario
- `GET /api/follows/following/:userId` - Obtener usuarios que sigue un usuario
- `POST /api/follows` - Seguir a un usuario
- `DELETE /api/follows/:id` - Dejar de seguir

### Notificaciones
- `GET /api/notifications` - Obtener todas las notificaciones
- `GET /api/notifications/:id` - Obtener una notificación por ID
- `GET /api/notifications/user/:userId` - Obtener notificaciones de un usuario
- `GET /api/notifications/user/:userId/unread` - Obtener notificaciones no leídas
- `POST /api/notifications` - Crear una notificación
- `PUT /api/notifications/:id` - Actualizar una notificación
- `PUT /api/notifications/user/:userId/read-all` - Marcar todas como leídas
- `DELETE /api/notifications/:id` - Eliminar una notificación

## 🐳 Docker Compose

El proyecto incluye dos servicios:

- **mongo**: Base de datos MongoDB
  - Puerto: `27018` (host) -> `27017` (container)
  - Volumen persistente en `/home/mongo-community-server:/data/db`

- **node-app**: API REST Node.js
  - Puerto: `3000:3000`
  - Construido desde el Dockerfile
  - Conectado automáticamente a MongoDB

## 📦 Dependencias

- **express**: ^4.18.2
- **mongoose**: ^7.0.0
- **dotenv**: ^16.0.0

## 🔧 Configuración

Las variables de entorno se configuran en `docker-compose.yml`:

- `MONGODB_URI`: URI de conexión a MongoDB
- `PORT`: Puerto del servidor (default: 3000)

## 📁 Estructura del Proyecto

```
Pivi/
├── crud-api/
│   ├── models/
│   │   ├── users.js
│   │   ├── posts.js
│   │   ├── comments.js
│   │   ├── likes.js
│   │   ├── follows.js
│   │   └── notifications.js
│   ├── routes/
│   │   ├── users.js
│   │   ├── posts.js
│   │   ├── comments.js
│   │   ├── likes.js
│   │   ├── follows.js
│   │   └── notifications.js
│   ├── app.js
│   └── package.json
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 🚀 Comandos Útiles

```bash
# Levantar los servicios
docker-compose up

# Levantar en segundo plano
docker-compose up -d

# Detener los servicios
docker-compose down

# Ver logs
docker-compose logs -f node-app

# Reconstruir después de cambios
docker-compose up --build

# Limpiar todo (incluye volúmenes)
docker-compose down -v
```

## 📝 Licencia

Este proyecto es de uso educativo.

