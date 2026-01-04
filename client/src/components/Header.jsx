import { Menu, Search } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import User from "./User";
import SearchBar from "./SearchBar";
import Logo from "./Logo";

function Header({ toggleSideBar }) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header className="flex justify-between items-center py-2 px-2 md:px-4 sticky top-0 bg-bg/95 backdrop-blur-sm z-40 gap-2">
      <div className="flex items-center gap-1 md:gap-2">
        <button
          onClick={toggleSideBar}
          className="hidden lg:flex cursor-pointer btn-secondary"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <Logo />
      </div>

      {/* Desktop Search Bar (hidden on mobile) */}
      <SearchBar
        isMobileSearchOpen={isMobileSearchOpen}
        onMobileSearchClose={() => setIsMobileSearchOpen(false)}
      />

      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Search Button (visible only on mobile) */}
        <button
          onClick={() => setIsMobileSearchOpen(true)}
          className="md:hidden btn-secondary"
          aria-label="Open search"
        >
          <Search size={24} />
        </button>
        <ThemeToggle />
        <User />
      </div>
    </header>
  );
}

export default Header;
