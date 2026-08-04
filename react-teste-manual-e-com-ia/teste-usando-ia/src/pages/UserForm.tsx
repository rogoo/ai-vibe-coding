import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createUser, getUser, updateUser } from '../api/userApi';

function UserForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id !== undefined;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === undefined) {
      return;
    }

    setLoading(true);
    setError(null);
    getUser(Number(id))
      .then((user) => {
        setName(user.name);
        setEmail(user.email);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = { name: name.trim(), email: email.trim() };
    const request = id === undefined ? createUser(payload) : updateUser(Number(id), payload);

    request
      .then(() => navigate('/users'))
      .catch((err: Error) => setError(err.message))
      .finally(() => setSaving(false));
  };

  return (
    <section className="page">
      <h1>{isEdit ? `Edit user #${id}` : 'New user'}</h1>

      {error && <p className="message message-error">{error}</p>}
      {loading && <p className="message">Loading user…</p>}

      {!loading && (
        <form className="form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="button button-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className="button" onClick={() => navigate('/users')}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default UserForm;
