import { Menu } from "lucide-react";
import { useSelector } from "react-redux";
import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router";
import User from "./User";

function Header() {
  const theme = useSelector((state) => state.theme);
  const logo = theme === "dark" ? "/logo_white.png" : "/logo_black.png";

  return (
    <header className="flex justify-between items-center">
      <div className="flex">
        {/* Sidebar Toggle */}
        <button>
          <Menu />
        </button>
        <Link to="/">
          <img src={logo} alt="YouTube Logo" width={100} />
        </Link>
      </div>
      <search></search>
      <div className="flex items-center">
        <ThemeToggle />
        <User />
      </div>
    </header>
  );
}

export default Header;
