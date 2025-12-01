'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usersAPI, postsAPI, type User, type Post } from '@/lib/api';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, postsData] = await Promise.all([
        usersAPI.getAll(),
        postsAPI.getAll(),
      ]);
      setUsers(usersData);
      setPosts(postsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Pivi - Red Social</h1>
        
        <div className="mb-6 flex gap-4 justify-center">
          <Link href="/users" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Ver Todos los Usuarios
          </Link>
          <Link href="/posts" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Ver Todos los Posts
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Usuarios */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Usuarios ({users.length})</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {users.slice(0, 5).map((user) => (
                <div key={user._id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-4">
                    {user.avatar && (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{user.username}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.bio && <p className="text-sm mt-1">{user.bio}</p>}
                    </div>
                  </div>
                </div>
              ))}
              {users.length > 5 && (
                <Link href="/users" className="text-blue-600 hover:underline text-sm">
                  Ver todos los usuarios ({users.length})
                </Link>
              )}
            </div>
          </div>

          {/* Posts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Posts ({posts.length})</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {posts.slice(0, 5).map((post) => {
                const user = typeof post.userId === 'object' ? post.userId : null;
                return (
                  <div key={post._id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      {user?.avatar && (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">{user?.username || 'Usuario'}</h3>
                      </div>
                    </div>
                    <p className="text-gray-800">{post.content}</p>
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post"
                        className="mt-2 rounded-lg max-w-full"
                      />
                    )}
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>❤️ {post.likesCount || 0}</span>
                      <span>💬 {post.commentsCount || 0}</span>
                    </div>
                  </div>
                );
              })}
              {posts.length > 5 && (
                <Link href="/posts" className="text-blue-600 hover:underline text-sm">
                  Ver todos los posts ({posts.length})
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
