import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useUsers } from "../../provider/UserContext";
import type { FormSubmitEvent } from "../../types/events";
import type { User } from "../../types/user";

interface UserDetailProps {
  /** `null` -> insert mode, a user -> edit mode. */
  user: User | null;
  onClose: () => void;
}

function recuperaCampos(name: string, email: string) {
  const campos: string[] = [];
  if (!name.trim()) {
    campos.push("Name");
  }
  if (!email.trim()) {
    campos.push("E-mail");
  }
  return campos.join(", ");
}

export function UserDetail({ user, onClose }: Readonly<UserDetailProps>) {
  const { addUser, updateUser, loading } = useUsers();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const nameRef = useRef<HTMLInputElement>(null);

  const isEdit = user !== null;

  // move focus into the dialog as soon as it opens
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  async function handleSubmit(event: FormSubmitEvent) {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.warning(
        `Campo obrigatório não preenchido: ${recuperaCampos(name, email)}`,
      );
      return;
    }

    const data = { name: name.trim(), email: email.trim() };
    const ok = isEdit ? await updateUser(user.id, data) : await addUser(data);

    if (ok) {
      onClose();
    }
  }

  return (
    <div className="user-detail__backdrop" onClick={onClose}>
      <div
        className="user-detail"
        aria-modal="true"
        aria-label={isEdit ? "Edit user" : "New user"}
        onClick={(event) => event.stopPropagation()}
      >
        <h2>{isEdit ? `Edit user #${user.id}` : "New user"}</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="detail-name">Name</label>
          <input
            id="detail-name"
            ref={nameRef}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <label htmlFor="detail-email">E-mail</label>
          <input
            id="detail-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <div className="user-detail__actions">
            <button
              type="submit"
              className="btn btn--primary"
              disabled={loading}
            >
              {isEdit ? "Save" : "Create"}
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserDetail;
