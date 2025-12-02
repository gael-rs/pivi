'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usersAPI, postsAPI, likesAPI, type User, type Post } from '@/lib/api';
import { getCurrentUser, logout } from '@/lib/auth';
import CreatePost from '@/components/CreatePost';

export default function Home() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [postLikes, setPostLikes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    loadData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadPostLikes();
    }
  }, [currentUser, posts]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, postsData] = await Promise.all([
        usersAPI.getAll(),
        postsAPI.getAll(),
      ]);
      setUsers(usersData);
      const sortedPosts = postsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPosts(sortedPosts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPostLikes = async () => {
    if (!currentUser || posts.length === 0) return;
    
    try {
      const likesMap: Record<string, boolean> = {};
      // Cargar likes de todos los posts en paralelo
      const likesPromises = posts.map(async (post) => {
        try {
          const likes = await likesAPI.getByPost(post._id);
          const hasLiked = likes.some(
            (like) => {
              const likeUserId = typeof like.userId === 'object' && like.userId !== null ? like.userId._id : like.userId;
              return likeUserId === currentUser._id;
            }
          );
          return { postId: post._id, hasLiked };
        } catch (err) {
          return { postId: post._id, hasLiked: false };
        }
      });
      
      const results = await Promise.all(likesPromises);
      results.forEach(({ postId, hasLiked }) => {
        likesMap[postId] = hasLiked;
      });
      
      setPostLikes(likesMap);
    } catch (err) {
      console.error('Error al cargar likes:', err);
    }
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) return;
    
    try {
      const hasLiked = postLikes[postId];
      
      if (hasLiked) {
        // Quitar like - buscar el like existente
        const likes = await likesAPI.getByPost(postId);
        const existingLike = likes.find(
          (like) => {
            const likeUserId = typeof like.userId === 'object' && like.userId !== null ? like.userId._id : like.userId;
            return likeUserId === currentUser._id;
          }
        );
        if (existingLike) {
          await likesAPI.delete(existingLike._id);
        }
      } else {
        // Dar like
        await likesAPI.create({
          postId,
          userId: currentUser._id,
        });
      }
      
      // Actualizar estado local
      setPostLikes({ ...postLikes, [postId]: !hasLiked });
      
      // Recargar posts para actualizar contador
      loadData();
    } catch (err) {
      console.error('Error al dar like:', err);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-xl text-orange-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-bold text-orange-600">
              Pivi
            </Link>
            <nav className="flex items-center gap-4">
              {currentUser ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-orange-600 hover:text-orange-700 font-medium"
                  >
                    {currentUser.avatar && (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.username}
                        className="w-10 h-10 rounded-full border-2 border-orange-200"
                      />
                    )}
                    <span>{currentUser.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                >
                  Iniciar Sesión
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {currentUser && <CreatePost onPostCreated={loadData} />}

        {/* Posts Feed */}
        <div className="space-y-6 mb-8">
          {posts.map((post) => {
            const user = typeof post.userId === 'object' && post.userId !== null ? post.userId : null;
            const postUserId = typeof post.userId === 'object' && post.userId !== null ? post.userId._id : (post.userId || null);
            const isOwner = currentUser && postUserId && currentUser._id === postUserId;
            
            return (
              <div key={post._id} className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
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
                  {isOwner && (
                    <Link
                      href={`/posts/${post._id}/edit`}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm"
                    >
                      Editar
                    </Link>
                  )}
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
                  <button
                    onClick={() => handleLike(post._id)}
                    disabled={!currentUser}
                    className={`flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                      postLikes[post._id] 
                        ? 'text-red-600 hover:text-red-700' 
                        : 'hover:text-orange-600'
                    }`}
                  >
                    <span className="text-xl">{postLikes[post._id] ? '❤️' : '🤍'}</span>
                    <span>{post.likesCount || 0}</span>
                  </button>
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
              <p className="text-gray-500 text-lg">No hay posts aún. ¡Sé el primero en publicar!</p>
            </div>
          )}
        </div>

        {/* Sidebar con usuarios */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Usuarios ({users.length})</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {users.slice(0, 10).map((user) => (
              <Link
                key={user._id}
                href={`/users/${user._id}`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-orange-50 transition"
              >
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-12 h-12 rounded-full border-2 border-orange-200"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-gray-800">{user.username}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </Link>
            ))}
            {users.length > 10 && (
              <Link
                href="/users"
                className="block text-center text-orange-600 hover:text-orange-700 font-medium py-2"
              >
                Ver todos los usuarios ({users.length})
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
