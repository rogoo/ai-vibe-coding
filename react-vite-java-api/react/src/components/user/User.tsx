import { useEffect, useState } from 'react';
import { useUsers } from '../../provider/UserContext';
import type { FormSubmitEvent } from '../../types/events';
import type { User as UserModel } from '../../types/user';
import UserDetail from './UserDetail';
import './User.css';

export function User() {
  const { users, loading, searchUsers, deleteUser } = useUsers();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [detailOpen, setDetailOpen] = useState(false);
  const [editing, setEditing] = useState<UserModel | null>(null);

  useEffect(() => {
    void searchUsers();
  }, [searchUsers]);

  function handleSearch(event: FormSubmitEvent) {
    event.preventDefault();
    void searchUsers({ name, email });
  }

  function handleClean() {
    setName('');
    setEmail('');
    void searchUsers();
  }

  function handleAddNew() {
    setEditing(null);
    setDetailOpen(true);
  }

  function handleEdit(user: UserModel) {
    setEditing(user);
    setDetailOpen(true);
  }

  function handleDelete(user: UserModel) {
    if (window.confirm(`Delete user "${user.name}"?`)) {
      void deleteUser(user.id);
    }
  }

  return (
    <section className="users">
      <h1>Users</h1>

      <form className="users__form" onSubmit={handleSearch}>
        <div className="users__field">
          <label htmlFor="filter-name">Name</label>
          <input
            id="filter-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="users__field">
          <label htmlFor="filter-email">E-mail</label>
          <input
            id="filter-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="users__buttons">
          <button type="submit" className="btn btn--primary" disabled={loading}>
            Search
          </button>
          <button type="button" className="btn" onClick={handleClean} disabled={loading}>
            Clean
          </button>
          <button type="button" className="btn btn--success" onClick={handleAddNew}>
            Add New
          </button>
        </div>
      </form>

      <table className="users__table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>E-mail</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="users__empty">
                {loading ? 'Loading…' : 'No users to show.'}
              </td>
            </tr>
          )}

          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td className="users__actions">
                <button type="button" className="btn" onClick={() => handleEdit(user)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn--danger"
                  onClick={() => handleDelete(user)}
                  disabled={loading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {detailOpen && (
        <UserDetail
          key={editing?.id ?? 'new'}
          user={editing}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </section>
  );
}

export default User;
