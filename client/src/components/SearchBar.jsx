import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

function SearchBar({ isMobileSearchOpen, onMobileSearchClose }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const searchQuery = new URLSearchParams(search).get("search") || "";
  const [query, setQuery] = useState(searchQuery);

  function handleSearch(evt) {
    evt.preventDefault();
    navigate(`/?search=${encodeURIComponent(query.trim())}`);
    if (onMobileSearchClose) {
      onMobileSearchClose();
    }
  }

  // keep searchBar value in sync with url search params
  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  return (
    <>
      {/* Desktop Search Bar - always visible on md+ */}
      <search className="hidden md:block border py-1.5 px-3 rounded-full border-fg/20 flex-1 max-w-2xl">
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="search"
            placeholder="Search for videos"
            className="focus:outline-0 bg-transparent w-full"
            value={query}
            onChange={(evt) => setQuery(evt.target.value)}
          />
          <button type="submit" aria-label="Search">
            <Search />
          </button>
        </form>
      </search>

      {/* Mobile Search Overlay - full screen when open */}
      {isMobileSearchOpen && (
        <div className="md:hidden fixed inset-0 bg-bg z-50 flex flex-col">
          <div className="flex items-center gap-2 p-4">
            <button
              onClick={onMobileSearchClose}
              className="btn-secondary"
              aria-label="Close search"
            >
              <X />
            </button>
            <search className="flex-1 border py-1.5 px-3 rounded-full border-fg/20">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="search"
                  placeholder="Search for videos"
                  className="focus:outline-0 bg-transparent w-full"
                  value={query}
                  onChange={(evt) => setQuery(evt.target.value)}
                  autoFocus
                />
                <button type="submit" aria-label="Search">
                  <Search />
                </button>
              </form>
            </search>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchBar;
