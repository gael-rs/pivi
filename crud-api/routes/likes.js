import express from 'express';
import Like from '../models/likes.js';
import Post from '../models/posts.js';

const router = express.Router();

// GET /api/likes - Obtener todos los likes
router.get('/', async (req, res) => {
  try {
    const likes = await Like.find()
      .populate('userId', 'username name profilePicture')
      .populate('postId', 'content')
      .sort({ createdAt: -1 });
    res.json(likes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/likes/:id - Obtener un like por ID
router.get('/:id', async (req, res) => {
  try {
    const like = await Like.findById(req.params.id)
      .populate('userId', 'username name profilePicture')
      .populate('postId', 'content');
    if (!like) {
      return res.status(404).json({ error: 'Like no encontrado' });
    }
    res.json(like);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/likes/post/:postId - Obtener likes de un post
router.get('/post/:postId', async (req, res) => {
  try {
    const likes = await Like.find({ postId: req.params.postId })
      .populate('userId', 'username name profilePicture');
    res.json(likes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/likes/user/:userId - Obtener likes de un usuario
router.get('/user/:userId', async (req, res) => {
  try {
    const likes = await Like.find({ userId: req.params.userId })
      .populate('postId', 'content');
    res.json(likes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/likes - Dar like a un post
router.post('/', async (req, res) => {
  try {
    const existingLike = await Like.findOne({
      postId: req.body.postId,
      userId: req.body.userId
    });
    
    if (existingLike) {
      return res.status(400).json({ error: 'Ya has dado like a este post' });
    }
    
    const like = new Like(req.body);
    await like.save();
    
    // Actualizar contador de likes del post
    await Post.findByIdAndUpdate(
      req.body.postId,
      { $inc: { likesCount: 1 } }
    );
    
    await like.populate('userId', 'username name profilePicture');
    res.status(201).json(like);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/likes/:id - Quitar like (eliminar)
router.delete('/:id', async (req, res) => {
  try {
    const like = await Like.findById(req.params.id);
    if (!like) {
      return res.status(404).json({ error: 'Like no encontrado' });
    }
    
    // Actualizar contador de likes del post
    await Post.findByIdAndUpdate(
      like.postId,
      { $inc: { likesCount: -1 } }
    );
    
    await Like.findByIdAndDelete(req.params.id);
    res.json({ message: 'Like eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/likes/post/:postId/user/:userId - Quitar like por post y usuario
router.delete('/post/:postId/user/:userId', async (req, res) => {
  try {
    const like = await Like.findOneAndDelete({
      postId: req.params.postId,
      userId: req.params.userId
    });
    
    if (!like) {
      return res.status(404).json({ error: 'Like no encontrado' });
    }
    
    // Actualizar contador de likes del post
    await Post.findByIdAndUpdate(
      req.params.postId,
      { $inc: { likesCount: -1 } }
    );
    
    res.json({ message: 'Like eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

