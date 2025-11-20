import express from 'express';
import Follow from '../models/follows.js';

const router = express.Router();

// GET /api/follows - Obtener todos los follows
router.get('/', async (req, res) => {
  try {
    const follows = await Follow.find()
      .populate('followerId', 'username name profilePicture')
      .populate('followingId', 'username name profilePicture')
      .sort({ createdAt: -1 });
    res.json(follows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/follows/:id - Obtener un follow por ID
router.get('/:id', async (req, res) => {
  try {
    const follow = await Follow.findById(req.params.id)
      .populate('followerId', 'username name profilePicture')
      .populate('followingId', 'username name profilePicture');
    if (!follow) {
      return res.status(404).json({ error: 'Follow no encontrado' });
    }
    res.json(follow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/follows/followers/:userId - Obtener seguidores de un usuario
router.get('/followers/:userId', async (req, res) => {
  try {
    const followers = await Follow.find({ followingId: req.params.userId })
      .populate('followerId', 'username name profilePicture')
      .sort({ createdAt: -1 });
    res.json(followers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/follows/following/:userId - Obtener usuarios que sigue un usuario
router.get('/following/:userId', async (req, res) => {
  try {
    const following = await Follow.find({ followerId: req.params.userId })
      .populate('followingId', 'username name profilePicture')
      .sort({ createdAt: -1 });
    res.json(following);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/follows - Seguir a un usuario
router.post('/', async (req, res) => {
  try {
    // No se puede seguir a uno mismo
    if (req.body.followerId === req.body.followingId) {
      return res.status(400).json({ error: 'No puedes seguirte a ti mismo' });
    }
    
    const existingFollow = await Follow.findOne({
      followerId: req.body.followerId,
      followingId: req.body.followingId
    });
    
    if (existingFollow) {
      return res.status(400).json({ error: 'Ya sigues a este usuario' });
    }
    
    const follow = new Follow(req.body);
    await follow.save();
    await follow.populate('followerId', 'username name profilePicture');
    await follow.populate('followingId', 'username name profilePicture');
    res.status(201).json(follow);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/follows/:id - Dejar de seguir (eliminar)
router.delete('/:id', async (req, res) => {
  try {
    const follow = await Follow.findByIdAndDelete(req.params.id);
    if (!follow) {
      return res.status(404).json({ error: 'Follow no encontrado' });
    }
    res.json({ message: 'Follow eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/follows/follower/:followerId/following/:followingId - Dejar de seguir por IDs
router.delete('/follower/:followerId/following/:followingId', async (req, res) => {
  try {
    const follow = await Follow.findOneAndDelete({
      followerId: req.params.followerId,
      followingId: req.params.followingId
    });
    
    if (!follow) {
      return res.status(404).json({ error: 'Follow no encontrado' });
    }
    
    res.json({ message: 'Follow eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

