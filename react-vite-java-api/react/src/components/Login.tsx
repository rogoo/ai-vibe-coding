import { useState } from "react";
import { Navigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../provider/AuthContext";
import type { FormSubmitEvent } from "../types/events";
import "./Login.css";

const FIXED_LOGIN = "rogoo";
const FIXED_PASSWORD = "admin123";

/** Eye icon; crossed out while the password is visible. */
function EyeIcon({ crossed }: { readonly crossed: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1.5 12S5.7 5.5 12 5.5 22.5 12 22.5 12 18.3 18.5 12 18.5 1.5 12 1.5 12z" />
      <circle cx="12" cy="12" r="3.2" />
      {crossed && <line x1="3" y1="21" x2="21" y2="3" />}
    </svg>
  );
}

export function Login() {
  const { user, signIn } = useAuth();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormSubmitEvent) {
    event.preventDefault();

    if (login === FIXED_LOGIN && password === FIXED_PASSWORD) {
      signIn(login);
      return;
    }

    toast.error("Invalid login or password.");
    setPassword("");
  }

  // already signed in: no reason to show the form again
  if (user !== null) {
    return <Navigate to="/user" replace />;
  }

  return (
    <div className="login">
      <form className="login__box" onSubmit={handleSubmit}>
        <h1>Sign in</h1>

        <label htmlFor="login">Login</label>
        <input
          id="login"
          name="login"
          autoComplete="username"
          value={login}
          onChange={(event) => setLogin(event.target.value)}
        />

        <label htmlFor="password">Password</label>
        <div className="login__password">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            type="button"
            className="login__toggle"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            title={showPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon crossed={showPassword} />
          </button>
        </div>

        <button type="submit">Enter</button>
      </form>
    </div>
  );
}

export default Login;
