import express from 'express';
import Notification from '../models/notifications.js';

const router = express.Router();

// GET /api/notifications - Obtener todas las notificaciones
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('userId', 'username name profilePicture')
      .populate('fromUserId', 'username name profilePicture')
      .populate('postId', 'content')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notifications/:id - Obtener una notificación por ID
router.get('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('userId', 'username name profilePicture')
      .populate('fromUserId', 'username name profilePicture')
      .populate('postId', 'content');
    if (!notification) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notifications/user/:userId - Obtener notificaciones de un usuario
router.get('/user/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId })
      .populate('fromUserId', 'username name profilePicture')
      .populate('postId', 'content')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notifications/user/:userId/unread - Obtener notificaciones no leídas de un usuario
router.get('/user/:userId/unread', async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      userId: req.params.userId,
      read: false 
    })
      .populate('fromUserId', 'username name profilePicture')
      .populate('postId', 'content')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/notifications - Crear una nueva notificación
router.post('/', async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    await notification.populate('fromUserId', 'username name profilePicture');
    await notification.populate('postId', 'content');
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/notifications/:id - Actualizar una notificación (marcar como leída)
router.put('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('userId', 'username name profilePicture')
      .populate('fromUserId', 'username name profilePicture')
      .populate('postId', 'content');
    
    if (!notification) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/notifications/user/:userId/read-all - Marcar todas las notificaciones como leídas
router.put('/user/:userId/read-all', async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.params.userId, read: false },
      { read: true }
    );
    res.json({ message: `${result.modifiedCount} notificaciones marcadas como leídas` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/notifications/:id - Eliminar una notificación
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }
    res.json({ message: 'Notificación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

