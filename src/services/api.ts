const BASE_URL = 'https://jsonplaceholder.typicode.com';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body?: string;
}

export const api = {
  users: {
    getAll: async (): Promise<User[]> => {
      const response = await fetch(`${BASE_URL}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },

    getById: async (id: number): Promise<User> => {
      const response = await fetch(`${BASE_URL}/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },

    create: async (userData: Omit<User, 'id'>): Promise<User> => {
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      if (!response.ok) throw new Error('Failed to create user');
      return response.json();
    },

    update: async (id: number, userData: Partial<User>): Promise<User> => {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },

    delete: async (id: number): Promise<void> => {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
    },
  },

  posts: {
    getAll: async (): Promise<Post[]> => {
      const response = await fetch(`${BASE_URL}/posts`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },

    getByUserId: async (userId: number): Promise<Post[]> => {
      const response = await fetch(`${BASE_URL}/users/${userId}/posts`);
      if (!response.ok) throw new Error('Failed to fetch user posts');
      return response.json();
    },

    create: async (postData: Omit<Post, 'id'>): Promise<Post> => {
      const response = await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      if (!response.ok) throw new Error('Failed to create post');
      return response.json();
    },

    update: async (id: number, postData: Partial<Post>): Promise<Post> => {
      const response = await fetch(`${BASE_URL}/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(postData),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      if (!response.ok) throw new Error('Failed to update post');
      return response.json();
    },

    delete: async (id: number): Promise<void> => {
      const response = await fetch(`${BASE_URL}/posts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete post');
    },
  },
};
