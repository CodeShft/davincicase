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
  const lowerSearchTerm = searchTerm.toLowerCase();
  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(lowerSearchTerm) ||
      user.username.toLowerCase().includes(lowerSearchTerm) ||
      user.email.toLowerCase().includes(lowerSearchTerm)
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
