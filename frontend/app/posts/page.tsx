'use client';

import { useEffect, useState } from 'react';
import { postsAPI, type Post } from '@/lib/api';
import Link from 'next/link';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getAll();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Cargando posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Volver al inicio
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-8">Posts</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {posts.map((post) => {
            const user = typeof post.userId === 'object' ? post.userId : null;
            return (
              <div key={post._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  {user?.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{user?.username || 'Usuario'}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-800 mb-4">{post.content}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="rounded-lg max-w-full mb-4"
                  />
                )}
                <div className="flex gap-6 text-sm text-gray-500">
                  <span>❤️ {post.likesCount || 0} likes</span>
                  <span>💬 {post.commentsCount || 0} comentarios</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

