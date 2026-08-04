import { SubmitEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createUser, getUser, updateUser } from "../../api/userApi";
import { UserPayload } from "../../types/user";
import { convertToPhoneNumber } from "../../utils/util";

function UserForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id !== undefined;

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
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

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload: UserPayload = { name: name.trim(), email: email.trim() };
    const request =
      id === undefined ? createUser(payload) : updateUser(Number(id), payload);

    request
      .then(() => navigate("/users"))
      .catch((err: Error) => setError(err.message))
      .finally(() => setSaving(false));
  };

  return (
    <section className="page">
      <h1>{isEdit ? `Edit user #${id}` : "New user"}</h1>

      {error && <p className="message message-error">{error}</p>}
      {loading && <p className="message">Loading user...</p>}

      {!loading && (
        <form className="form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Name</span>
            <input
              type="text"
              value={name}
              maxLength={45}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="text"
              value={email}
              maxLength={50}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Telefone</span>
            <input
              type="text"
              value={convertToPhoneNumber(telefone)}
              onChange={(event) =>
                setTelefone(convertToPhoneNumber(event.target.value))
              }
              required
            />
          </label>

          <div className="form-actions">
            <button
              type="submit"
              className="button button-primary"
              disabled={saving || !name || !email}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="button"
              onClick={() => navigate("/users")}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default UserForm;
