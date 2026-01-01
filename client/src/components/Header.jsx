import { Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import User from "./User";
import SearchBar from "./SearchBar";
import Logo from "./Logo";

function Header({ toggleSideBar }) {
  return (
    <header className="flex justify-between items-center">
      <div className="flex">
        {/* Sidebar Toggle */}
        <button onClick={toggleSideBar}>
          <Menu />
        </button>
        <Logo />
      </div>
      <SearchBar />
      <div className="flex items-center">
        <ThemeToggle />
        <User />
      </div>
    </header>
  );
}

export default Header;
