'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { usersAPI, postsAPI, type User, type Post } from '@/lib/api';

export default function UserPage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [userData, postsData] = await Promise.all([
        usersAPI.getById(userId),
        postsAPI.getByUser(userId),
      ]);
      setUser(userData);
      setUserPosts(postsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setError(null);
    } catch (err) {
      setError('Error al cargar datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-xl text-orange-600">Cargando...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-xl text-red-600">{error || 'Usuario no encontrado'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/users" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6">
          ← Volver a usuarios
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-start gap-6">
            {user.avatar && (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-32 h-32 rounded-full border-4 border-orange-200"
              />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{user.username}</h1>
              <p className="text-gray-600 mb-3">{user.email}</p>
              {user.bio && (
                <p className="text-gray-700 mb-4">{user.bio}</p>
              )}
              <p className="text-sm text-gray-500">
                Miembro desde {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Posts de {user.username} ({userPosts.length})
          </h2>
          <div className="space-y-6">
            {userPosts.map((post) => {
              return (
                <div key={post._id} className="border-b pb-6 last:border-0">
                  <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="rounded-lg max-w-full mb-4"
                    />
                  )}
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>❤️ {post.likesCount || 0}</span>
                    <span>💬 {post.commentsCount || 0}</span>
                    <span className="ml-auto">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
            {userPosts.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                {user.username} no ha creado posts aún.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

