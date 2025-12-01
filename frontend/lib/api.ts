const API_BASE_URL = 'http://20.97.214.126:3000/api';

// Tipos de datos
export interface User {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  userId: string | User;
  content: string;
  image?: string;
  likesCount?: number;
  commentsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  postId: string | Post;
  userId: string | User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  _id: string;
  postId: string | Post;
  userId: string | User;
  createdAt: string;
}

export interface Follow {
  _id: string;
  followerId: string | User;
  followingId: string | User;
  createdAt: string;
}

export interface Notification {
  _id: string;
  userId: string | User;
  fromUserId?: string | User;
  postId?: string | Post;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Función helper para hacer requests
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `Error ${response.status}`);
  }

  return response.json();
}

// API de Usuarios
export const usersAPI = {
  login: (email: string, password: string) => fetchAPI<User>('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  getAll: () => fetchAPI<User[]>('/users'),
  getById: (id: string) => fetchAPI<User>(`/users/${id}`),
  create: (data: Partial<User & { password: string }>) => fetchAPI<User>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, bio: string) => fetchAPI<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ bio }),
  }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/users/${id}`, {
    method: 'DELETE',
  }),
};

// API de Posts
export const postsAPI = {
  getAll: () => fetchAPI<Post[]>('/posts'),
  getById: (id: string) => fetchAPI<Post>(`/posts/${id}`),
  getByUser: (userId: string) => fetchAPI<Post[]>(`/posts/user/${userId}`),
  create: (data: Partial<Post>) => fetchAPI<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<Post>) => fetchAPI<Post>(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/posts/${id}`, {
    method: 'DELETE',
  }),
};

// API de Comentarios
export const commentsAPI = {
  getAll: () => fetchAPI<Comment[]>('/comments'),
  getById: (id: string) => fetchAPI<Comment>(`/comments/${id}`),
  getByPost: (postId: string) => fetchAPI<Comment[]>(`/comments/post/${postId}`),
  create: (data: Partial<Comment>) => fetchAPI<Comment>('/comments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<Comment>) => fetchAPI<Comment>(`/comments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/comments/${id}`, {
    method: 'DELETE',
  }),
};

// API de Likes
export const likesAPI = {
  getAll: () => fetchAPI<Like[]>('/likes'),
  getById: (id: string) => fetchAPI<Like>(`/likes/${id}`),
  getByPost: (postId: string) => fetchAPI<Like[]>(`/likes/post/${postId}`),
  getByUser: (userId: string) => fetchAPI<Like[]>(`/likes/user/${userId}`),
  create: (data: Partial<Like>) => fetchAPI<Like>('/likes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/likes/${id}`, {
    method: 'DELETE',
  }),
  deleteByPostAndUser: (postId: string, userId: string) => fetchAPI<{ message: string }>(`/likes/post/${postId}/user/${userId}`, {
    method: 'DELETE',
  }),
};

// API de Follows
export const followsAPI = {
  getAll: () => fetchAPI<Follow[]>('/follows'),
  getById: (id: string) => fetchAPI<Follow>(`/follows/${id}`),
  getFollowers: (userId: string) => fetchAPI<Follow[]>(`/follows/followers/${userId}`),
  getFollowing: (userId: string) => fetchAPI<Follow[]>(`/follows/following/${userId}`),
  create: (data: Partial<Follow>) => fetchAPI<Follow>('/follows', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/follows/${id}`, {
    method: 'DELETE',
  }),
  unfollow: (followerId: string, followingId: string) => fetchAPI<{ message: string }>(`/follows/follower/${followerId}/following/${followingId}`, {
    method: 'DELETE',
  }),
};

// API de Notificaciones
export const notificationsAPI = {
  getAll: () => fetchAPI<Notification[]>('/notifications'),
  getById: (id: string) => fetchAPI<Notification>(`/notifications/${id}`),
  getByUser: (userId: string) => fetchAPI<Notification[]>(`/notifications/user/${userId}`),
  getUnread: (userId: string) => fetchAPI<Notification[]>(`/notifications/user/${userId}/unread`),
  create: (data: Partial<Notification>) => fetchAPI<Notification>('/notifications', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<Notification>) => fetchAPI<Notification>(`/notifications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  markAllAsRead: (userId: string) => fetchAPI<{ message: string }>(`/notifications/user/${userId}/read-all`, {
    method: 'PUT',
  }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/notifications/${id}`, {
    method: 'DELETE',
  }),
};

