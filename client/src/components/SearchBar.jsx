import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

function SearchBar() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const searchQuery = new URLSearchParams(search).get("search") || "";
  const [query, setQuery] = useState(searchQuery);

  function handleSearch(evt) {
    evt.preventDefault();
    navigate(`/?search=${encodeURIComponent(query.trim())}`);
  }

  // keep searchBar value in sync with url search params
  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  return (
    <search className="border flex items-center p-2">
      <form onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="search for videos"
          className="focus:outline-0"
          value={query}
          onChange={(evt) => setQuery(evt.target.value)}
        />
        <button type="submit">
          <Search />
        </button>
      </form>
    </search>
  );
}

export default SearchBar;
