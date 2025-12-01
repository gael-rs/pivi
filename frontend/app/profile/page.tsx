'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usersAPI, postsAPI, type User, type Post } from '@/lib/api';
import { getCurrentUser, setCurrentUser, logout } from '@/lib/auth';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    loadUserData(currentUser._id);
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      setLoading(true);
      const [userData, postsData] = await Promise.all([
        usersAPI.getById(userId),
        postsAPI.getByUser(userId),
      ]);
      setUser(userData);
      setUserPosts(postsData);
      setBio(userData.bio || '');
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBio = async () => {
    if (!user) return;
    try {
      const updatedUser = await usersAPI.update(user._id, bio);
      setUser(updatedUser);
      setCurrentUser(updatedUser);
      setEditing(false);
    } catch (err) {
      alert('Error al actualizar biografía');
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      return;
    }
    try {
      setDeleting(true);
      await usersAPI.delete(user._id);
      logout();
      router.push('/login');
    } catch (err) {
      alert('Error al eliminar cuenta');
      setDeleting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este post?')) return;
    try {
      await postsAPI.delete(postId);
      if (user) {
        loadUserData(user._id);
      }
    } catch (err) {
      alert('Error al eliminar post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6">
          ← Volver al inicio
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-24 h-24 rounded-full border-4 border-orange-200"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Miembro desde {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Biografía</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                >
                  Editar
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  rows={4}
                  placeholder="Cuéntanos sobre ti..."
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleUpdateBio}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setBio(user.bio || '');
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700">{user.bio || 'No hay biografía aún.'}</p>
            )}
          </div>

          <div className="border-t pt-6 mt-6">
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {deleting ? 'Eliminando...' : 'Eliminar Cuenta'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Mis Posts ({userPosts.length})
          </h2>
          <div className="space-y-6">
            {userPosts.map((post) => {
              return (
                <div key={post._id} className="border-b pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-4">
                    <p className="text-gray-800 flex-1 whitespace-pre-wrap">{post.content}</p>
                    <div className="flex gap-2 ml-4">
                      <Link
                        href={`/posts/${post._id}/edit`}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="rounded-lg max-w-full mb-3"
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
              <p className="text-gray-500 text-center py-8">No has creado posts aún.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

