import { Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import User from "./User";
import SearchBar from "./SearchBar";
import Logo from "./Logo";

function Header({ toggleSideBar }) {
  return (
    <header className="flex justify-between items-center py-2 px-4 sticky top-0 bg-bg/95">
      <div className="flex items-center">
        {/* Sidebar Toggle */}
        <button onClick={toggleSideBar} className="cursor-pointer btn-secondary">
          <Menu />
        </button>
        <Logo />
      </div>
      <SearchBar />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <User />
      </div>
    </header>
  );
}

export default Header;
