import { Menu, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router";

function Header() {
  const theme = useSelector((state) => state.theme);
  const logo = theme === "dark" ? "/logo_white.png" : "/logo_black.png";
  const user = useSelector((state) => state.user);
  const isAuthenticated = !!user.accessToken;
  console.log(user);

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
        {isAuthenticated ? (
          <>
            <button>
              <Plus />
              <span>Create</span>
            </button>
            <span>
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                <span>{user.username}</span>
              )}
            </span>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
}

export default Header;
