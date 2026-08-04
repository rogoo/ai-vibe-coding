import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteUser, getUsers } from "../../api/userApi";
import { User } from "../../types/user";

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");

  const loadUsers = useCallback(() => {
    setLoading(true);
    setError(null);
    getUsers()
      .then((data) => setUsers(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const name = nameFilter.trim().toLowerCase();
    const email = emailFilter.trim().toLowerCase();

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(name) &&
        user.email.toLowerCase().includes(email),
    );
  }, [users, nameFilter, emailFilter]);

  const handleDelete = (user: User) => {
    if (!window.confirm(`Delete user "${user.name}"?`)) {
      return;
    }

    setError(null);
    deleteUser(user.id)
      .then(() =>
        setUsers((current) => current.filter((item) => item.id !== user.id)),
      )
      .catch((err: Error) => setError(err.message));
  };

  const clearFilters = () => {
    setNameFilter("");
    setEmailFilter("");
  };

  return (
    <section className="page">
      <div className="page-header">
        <h1>Users</h1>
        <Link className="button button-primary" to="/users/new">
          New user
        </Link>
      </div>

      <div className="filters">
        <label className="field">
          <span>Filter by name</span>
          <input
            type="text"
            value={nameFilter}
            onChange={(event) => setNameFilter(event.target.value)}
            placeholder="e.g. Rodrigo"
            formNoValidate
          />
        </label>

        <label className="field">
          <span>Filter by email</span>
          <input
            type="text"
            value={emailFilter}
            onChange={(event) => setEmailFilter(event.target.value)}
            placeholder="e.g. @gmail.com"
            formNoValidate
          />
        </label>

        <button type="button" className="button" onClick={clearFilters}>
          Clear
        </button>
        <button type="button" className="button" onClick={loadUsers}>
          Reload
        </button>
      </div>

      {error && <p className="message message-error">{error}</p>}
      {loading && <p className="message">Loading users...</p>}

      {!loading && !error && (
        <table className="table">
          <thead>
            <tr>
              <th className="table-id">Id</th>
              <th>Name</th>
              <th>Email</th>
              <th className="table-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className="table-actions">
                  <Link className="button" to={`/users/${user.id}/edit`}>
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="button button-danger"
                    onClick={() => handleDelete(user)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="table-empty">
                  {users.length === 0
                    ? "No users yet."
                    : "No users match the filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default UserList;
