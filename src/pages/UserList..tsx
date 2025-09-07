import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "../components/Header";
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
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueryData<User[]>(["users"]);
      queryClient.setQueryData<User[]>(["users"], (old = []) =>
        old.filter((user) => user.id !== userId)
      );
      return { previousUsers };
    },
    onError: (_err, _variables, context) => {
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <Header />
      <main className="pt-20 sm:pt-24 px-2 sm:px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-amber-900">Users List</h2>
              <div className="w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="border border-amber-200 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  onChange={(e) => debouncedSearch(e.target.value)}
                />
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              <input
                className="border border-amber-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className="border border-amber-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                className="border border-amber-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-amber-600 text-white rounded-lg px-6 py-2 hover:bg-amber-700 transition-colors duration-200 w-full sm:w-auto"
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
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-amber-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-amber-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-amber-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-amber-600 hover:text-amber-800"
                            disabled={deleteMutation.isPending}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
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
