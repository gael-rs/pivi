import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Importar rutas
import usuariosRoutes from './routes/users.js';
import postsRoutes from './routes/posts.js';
import likesRoutes from './routes/likes.js'; // Nueva ruta para "likes"
import comentariosRoutes from './routes/comments.js';
import followRoutes from './routes/follows.js';
import notificationRoutes from './routes/notifications.js';

// Configurar dotenv
dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Rutas
app.use('/api/users', usuariosRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/likes', likesRoutes); // Ruta para "likes"
app.use('/api/comments', comentariosRoutes); // Ruta para "comentarios"
app.use('/api/follows', followRoutes); // Ruta para "follow"
app.use('/api/notifications', notificationRoutes); // Ruta para "notifications"

// Conectar a MongoDB y arrancar servidor
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  });

