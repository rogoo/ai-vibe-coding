import { NavLink } from "react-router-dom";
import "./Header.css";

function Header() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "header-link header-link-active" : "header-link";

  return (
    <header className="header">
      <span className="header-brand">User Manager</span>
      <nav className="header-nav">
        <NavLink to="/about" className={linkClass}>
          About
        </NavLink>
        <NavLink to="/users" className={linkClass}>
          User
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
