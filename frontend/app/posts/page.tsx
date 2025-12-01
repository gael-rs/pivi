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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium">
            ← Volver al inicio
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Posts</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {posts.map((post) => {
            const user = typeof post.userId === 'object' ? post.userId : null;
            return (
              <div key={post._id} className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  {user?.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-12 h-12 rounded-full border-2 border-orange-200"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800">{user?.username || 'Usuario'}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="rounded-lg max-w-full mb-4"
                  />
                )}
                <div className="flex items-center gap-6 text-gray-600">
                  <span className="flex items-center gap-2">
                    <span className="text-xl">❤️</span>
                    <span>{post.likesCount || 0}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-xl">💬</span>
                    <span>{post.commentsCount || 0}</span>
                  </span>
                </div>
              </div>
            );
          })}
          {posts.length === 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <p className="text-gray-500 text-lg">No hay posts aún.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

