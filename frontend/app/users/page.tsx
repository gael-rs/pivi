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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Volver al inicio
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-8">Usuarios</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((user) => (
            <div key={user._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4">
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-16 h-16 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{user.username}</h2>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                  {user.bio && (
                    <p className="text-gray-800 mt-2">{user.bio}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Creado: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

