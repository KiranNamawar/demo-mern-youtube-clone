import { Menu, Moon } from "lucide-react";
import { useSelector } from "react-redux";
import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router";

function Header() {
  const theme = useSelector((state) => state.theme);
  const logo = theme === "dark" ? "/logo_white.png" : "/logo_black.png";
  return (
    <header>
      <div>
        {/* Sidebar Toggle */}
        <button>
          <Menu />
        </button>
        <Link to="/">
          <img src={logo} alt="YouTube Logo" />
        </Link>
      </div>
      <search></search>
      <div>
        <ThemeToggle />
        <button>Login</button>
      </div>
    </header>
  );
}

export default Header;
