import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../lib/api";
import { setVideos } from "../state/videosSlice";

function SearchBar() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const fetchVideos = useCallback(
    (searchTerm) => {
      const trimmed = searchTerm.trim();
      const url =
        trimmed && trimmed.length >= 3
          ? `/videos?search=${encodeURIComponent(searchTerm)}`
          : "/videos";

      api
        .get(url)
        .then((res) => dispatch(setVideos(res.data.data)))
        .catch(console.error);
    },
    [dispatch]
  );

  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchVideos(query);
    }, 300);

    return () => clearTimeout(timerId);
  }, [query, fetchVideos]);

  return (
    <search className="border flex items-center p-2">
      <input
        type="search"
        placeholder="search for videos"
        className="focus:outline-0"
        value={query}
        onChange={(evt) => setQuery(evt.target.value)}
      />
    </search>
  );
}

export default SearchBar;
