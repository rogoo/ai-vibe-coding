import { useCallback, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { toErrorMessage, userApi } from "../api/userApi";
import type { User, UserFilter, UserInput } from "../types/user";
import { UserContext, type UserContextValue } from "./UserContext";

export function UserProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = useCallback(async (filter: UserFilter = {}) => {
    setLoading(true);
    try {
      const params: UserFilter = {};
      if (filter.name?.trim()) {
        params.name = filter.name.trim();
      }
      if (filter.email?.trim()) {
        params.email = filter.email.trim();
      }

      const { data } = await userApi.get<User[]>("", { params });
      setUsers(data ?? []);
    } catch (error) {
      toast.error(toErrorMessage(error, "Could not load the users."));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = useCallback(async (data: UserInput) => {
    setLoading(true);
    try {
      const { data: created } = await userApi.post<User>("", data);
      setUsers((current) => [...current, created]);
      toast.success(`User "${created.name}" created.`);
      return true;
    } catch (error) {
      toast.error(toErrorMessage(error, "Could not create the user."));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: number, data: UserInput) => {
    setLoading(true);
    try {
      const { data: updated } = await userApi.put<User>(`/${id}`, {
        id,
        ...data,
      });
      setUsers((current) =>
        current.map((user) =>
          user.id === id ? (updated ?? { id, ...data }) : user,
        ),
      );
      toast.success(`User "${data.name}" updated.`);
      return true;
    } catch (error) {
      toast.error(toErrorMessage(error, "Could not update the user."));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await userApi.delete(`/${id}`);
      setUsers((current) => current.filter((user) => user.id !== id));
      toast.success("User deleted.");
      return true;
    } catch (error) {
      toast.error(toErrorMessage(error, "Could not delete the user."));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({ users, loading, searchUsers, addUser, updateUser, deleteUser }),
    [users, loading, searchUsers, addUser, updateUser, deleteUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
