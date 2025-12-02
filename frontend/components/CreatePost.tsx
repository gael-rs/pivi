'use client';

import { useState } from 'react';
import { postsAPI, type Post } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';

interface CreatePostProps {
  onPostCreated: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) {
      setError('Debes iniciar sesión para crear un post');
      return;
    }

    if (!content.trim()) {
      setError('El contenido no puede estar vacío');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await postsAPI.create({
        userId: user._id,
        content,
        image: image || undefined,
      });
      setContent('');
      setImage('');
      onPostCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Crear Nuevo Post</h2>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-gray-900"
          placeholder="¿Qué estás pensando?"
          rows={4}
          required
        />
        <input
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-gray-900"
          placeholder="URL de imagen (opcional)"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  );
}

