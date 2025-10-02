import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import { api } from "../services/api";
import type { User } from "../services/api";
import { useFiltersStore, filterUsers } from "../store/filters";
import debounce from "lodash/debounce";

export default function Users() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const { searchTerm, setSearchTerm } = useFiltersStore(
    (state) => state.userFilters
  );

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: api.users.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (userData: Omit<User, "id">) => api.users.create(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: Partial<User> }) =>
      api.users.update(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.users.delete,
    onMutate: async (userId: number) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueryData<User[]>(["users"]);
      queryClient.setQueryData<User[]>(["users"], (old: User[] = []) =>
        old.filter((user) => user.id !== userId)
      );
      return { previousUsers };
    },
    onError: (
      _err: unknown,
      _variables: unknown,
      context: { previousUsers: User[] | undefined } | undefined
    ) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },
  });

  const filteredUsers = filterUsers(users, searchTerm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) {
      updateMutation.mutate({
        id: editId,
        userData: { name, username, email },
      });
      setEditId(null);
    } else {
      createMutation.mutate({ name, username, email });
    }
    setName("");
    setUsername("");
    setEmail("");
  };

  const handleEdit = (user: User) => {
    setEditId(user.id);
    setName(user.name);
    setUsername(user.username);
    setEmail(user.email);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const debouncedSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="fixed top-24 sm:top-20 bottom-0 left-0 right-0 overflow-y-auto px-2 sm:px-4">
        <div className="max-w-7xl mx-auto py-8 mt-2 sm:mt-0 flex flex-col gap-8">
          <div className="bg-amber-950/90 rounded-xl shadow-lg p-4 sm:p-6 border border-amber-600/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-amber-200">
                Users List
              </h2>
              <div className="w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="border border-amber-500/30 bg-amber-900/30 text-amber-100 placeholder-amber-400/70 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-amber-500 focus-visible:ring-amber-500"
                  onChange={(e) => debouncedSearch(e.target.value)}
                />
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 px-4 sm:px-0"
            >
              <input
                className="border border-amber-500/30 bg-amber-900/30 text-amber-100 placeholder-amber-400/70 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus-visible:ring-amber-500 h-10"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className="border border-amber-500/30 bg-amber-900/30 text-amber-100 placeholder-amber-400/70 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus-visible:ring-amber-500 h-10"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                className="border border-amber-500/30 bg-amber-900/30 text-amber-100 placeholder-amber-400/70 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus-visible:ring-amber-500 h-10"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg h-10 px-6 hover:from-amber-600 hover:to-amber-700 transition-all duration-200 w-full sm:w-auto shadow-lg shadow-amber-500/20 font-medium text-sm focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editId !== null ? "Update User" : "Add User"}
              </button>
            </form>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto mb-0 table-container">
                <table className="min-w-full divide-y divide-amber-500/30 bg-amber-950/90">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-500/30">
                    {filteredUsers.map((user: User) => (
                      <tr key={user.id} className="hover:bg-amber-800/50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-amber-100">
                          {user.id}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-amber-100">
                          {user.name}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-amber-100">
                          {user.username}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-amber-100">
                          {user.email}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="px-2 py-0.5 bg-amber-600/20 text-amber-400 rounded hover:bg-amber-600/30 transition-colors duration-200 text-[11px]"
                              disabled={deleteMutation.isPending}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="px-2 py-0.5 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors duration-200 text-[11px]"
                              disabled={deleteMutation.isPending}
                            >
                              Delete
                            </button>
                          </div>
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
