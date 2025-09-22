import { create } from "zustand";
import type { User, Post } from "../services/api";

interface FiltersState {
  userFilters: {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
  };
  postFilters: {
    searchTerm: string;
    selectedUserId: number | null;
    setSearchTerm: (term: string) => void;
    setSelectedUserId: (userId: number | null) => void;
  };
}

export const useFiltersStore = create<FiltersState>((set) => ({
  userFilters: {
    searchTerm: "",
    setSearchTerm: (term: string) =>
      set((state) => ({
        userFilters: {
          ...state.userFilters,
          searchTerm: term,
        },
      })),
  },
  postFilters: {
    searchTerm: "",
    selectedUserId: null,
    setSearchTerm: (term: string) =>
      set((state) => ({
        postFilters: {
          ...state.postFilters,
          searchTerm: term,
        },
      })),
    setSelectedUserId: (userId: number | null) =>
      set((state) => ({
        postFilters: {
          ...state.postFilters,
          selectedUserId: userId,
        },
      })),
  },
}));


export const filterUsers = (users: User[], searchTerm: string): User[] => {
  if (!searchTerm) return users;
  const searchChar = searchTerm.toLowerCase()[0];
  return users.filter(
    (user) => user.name.toLowerCase()[0] === searchChar
  );
};

export const filterPosts = (
  posts: Post[],
  searchTerm: string,
  selectedUserId: number | null
): Post[] => {
  let filteredPosts = posts;

  if (selectedUserId !== null) {
    filteredPosts = filteredPosts.filter(
      (post) => post.userId === selectedUserId
    );
  }

  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    filteredPosts = filteredPosts.filter((post) =>
      post.title.toLowerCase().includes(lowerSearchTerm)
    );
  }

  return filteredPosts;
};

// Kullanıcı ve postları birlikte filtreleyen fonksiyon
export type CombinedItem =
  | ({ type: "user" } & User)
  | ({ type: "post" } & Post);

export const filterCombined = (
  users: User[],
  posts: Post[],
  searchTerm: string
): CombinedItem[] => {
  const lowerSearchTerm = searchTerm.toLowerCase();

  // Arama kutusu boşsa tüm kullanıcı ve postları göster
  if (!lowerSearchTerm) {
    const allUsers = users.map((user) => ({ ...user, type: "user" as const }));
    const allPosts = posts.map((post) => {
      const user = users.find((u) => u.id === post.userId);
      return {
        ...post,
        type: "post" as const,
        email: user?.email || "-"
      };
    });
    return [...allUsers, ...allPosts];
  }

  // Arama varsa baş harfe göre filtrele
  const filteredUsers = users
    .filter((user) => user.name.toLowerCase().startsWith(lowerSearchTerm[0]))
    .map((user) => ({ ...user, type: "user" as const }));

  const filteredPosts = posts
    .filter((post) => {
      const user = users.find((u) => u.id === post.userId);
      if (!user || !user.username) return false;
      return user.username.toLowerCase().startsWith(lowerSearchTerm[0]);
    })
    .map((post) => {
      const user = users.find((u) => u.id === post.userId);
      return {
        ...post,
        type: "post" as const,
        email: user?.email || "-"
      };
    });

  return [...filteredUsers, ...filteredPosts];
};
