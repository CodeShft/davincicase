import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "../components/Header";
import { api } from "../services/api";
import type { Post } from "../services/api";
import { useFiltersStore, filterPosts } from "../store/filters";
import debounce from "lodash/debounce";

export default function Posts() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState<number>(1);
  const [editId, setEditId] = useState<number | null>(null);

  const { searchTerm, selectedUserId, setSearchTerm, setSelectedUserId } =
    useFiltersStore((state) => state.postFilters);

  const { data: posts = [], isLoading: isLoadingPosts } = useQuery({
    queryKey: ["posts"],
    queryFn: api.posts.getAll,
  });

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: api.users.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (postData: Omit<Post, "id">) => api.posts.create(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, postData }: { id: number; postData: Partial<Post> }) =>
      api.posts.update(id, postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.posts.delete,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);
      queryClient.setQueryData<Post[]>(["posts"], (old = []) =>
        old.filter((post) => post.id !== postId)
      );
      return { previousPosts };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },
  });

  const isLoading = isLoadingPosts || isLoadingUsers;

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) {
      updateMutation.mutate({
        id: editId,
        postData: { title, userId },
      });
      setEditId(null);
    } else {
      createMutation.mutate({ title, userId });
    }
    setTitle("");
    setUserId(1);
  };

  const handleEdit = (post: Post) => {
    setEditId(post.id);
    setTitle(post.title);
    setUserId(post.userId);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const debouncedSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  const filteredPosts = filterPosts(posts, searchTerm, selectedUserId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <Header />
      <main className="pt-32 sm:pt-24 px-2 sm:px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-amber-900">Posts List</h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <select
                  className="border border-amber-200 rounded-lg px-4 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={selectedUserId || ""}
                  onChange={(e) =>
                    setSelectedUserId(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                >
                  <option value="">All Users</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="border border-amber-200 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  onChange={(e) => debouncedSearch(e.target.value)}
                />
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
            >
              <select
                className="border border-amber-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={userId}
                onChange={(e) => setUserId(Number(e.target.value))}
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <input
                className="border border-amber-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-amber-600 text-white rounded-lg px-6 py-2 hover:bg-amber-700 transition-colors duration-200 w-full sm:w-auto"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editId !== null ? "Update Post" : "Add Post"}
              </button>
            </form>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-amber-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-amber-200">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-amber-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {post.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {post.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getUserName(post.userId)}
                          <span className="ml-2 text-xs text-gray-500">
                            (ID: {post.userId})
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEdit(post)}
                            className="text-amber-600 hover:text-amber-800"
                            disabled={deleteMutation.isPending}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="text-red-600 hover:text-red-800"
                            disabled={deleteMutation.isPending}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
