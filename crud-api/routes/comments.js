import express from 'express';
import Comment from '../models/comments.js';
import Post from '../models/posts.js';

const router = express.Router();

// GET /api/comments - Obtener todos los comentarios
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('userId', 'username name profilePicture')
      .populate('postId', 'content')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/comments/:id - Obtener un comentario por ID
router.get('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('userId', 'username name profilePicture')
      .populate('postId', 'content');
    if (!comment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/comments/post/:postId - Obtener comentarios de un post
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('userId', 'username name profilePicture')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/comments - Crear un nuevo comentario
router.post('/', async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    
    // Actualizar contador de comentarios del post
    await Post.findByIdAndUpdate(
      req.body.postId,
      { $inc: { commentsCount: 1 } }
    );
    
    await comment.populate('userId', 'username name profilePicture');
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/comments/:id - Actualizar un comentario
router.put('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('userId', 'username name profilePicture');
    
    if (!comment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    res.json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/comments/:id - Eliminar un comentario
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    
    // Actualizar contador de comentarios del post
    await Post.findByIdAndUpdate(
      comment.postId,
      { $inc: { commentsCount: -1 } }
    );
    
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comentario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

