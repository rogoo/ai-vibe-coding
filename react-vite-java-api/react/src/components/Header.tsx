import { NavLink } from "react-router";
import { useAuth } from "../provider/AuthContext";
import "./Header.css";

export function Header() {
  const { user, signOut } = useAuth();
  const isLoggedIn = user !== null;

  return (
    <header className="header">
      <nav className="header__nav">
        {!isLoggedIn && (
          <NavLink to="/" end className="header__link">
            Login
          </NavLink>
        )}

        {isLoggedIn ? (
          <NavLink to="/user" className="header__link">
            Users
          </NavLink>
        ) : (
          <span
            className="header__link header__link--disabled"
            aria-disabled="true"
            title="Sign in to manage users"
          >
            Users
          </span>
        )}
      </nav>

      {isLoggedIn && (
        <div className="header__session">
          <span>
            Signed in as <strong>{user}</strong>
          </span>
          <button type="button" className="btn" onClick={signOut}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
