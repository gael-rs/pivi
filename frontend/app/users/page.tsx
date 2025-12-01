'use client';

import { useEffect, useState } from 'react';
import { usersAPI, type User } from '@/lib/api';
import Link from 'next/link';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getAll();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium">
            ← Volver al inicio
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Usuarios</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Link
              key={user._id}
              href={`/users/${user._id}`}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-20 h-20 rounded-full border-4 border-orange-200 mb-4"
                  />
                )}
                <h2 className="text-xl font-bold text-gray-800 mb-1">{user.username}</h2>
                <p className="text-gray-600 text-sm mb-2">{user.email}</p>
                {user.bio && (
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">{user.bio}</p>
                )}
                <p className="text-xs text-gray-500">
                  Desde {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

