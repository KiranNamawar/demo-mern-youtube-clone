import { Search } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import api from "../lib/api";
import { setVideos } from "../state/videosSlice";

function SearchBar() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  return (
    <search className="border flex items-center p-2">
      <input
        type="search"
        placeholder="search for videos"
        className="focus:outline-0"
        value={query}
        onChange={(evt) => setQuery(evt.target.value)}
      />
      <button
        onClick={() => {
          api
            .get(`/videos?search=${query}`)
            .then((res) => dispatch(setVideos(res.data.data)))
            .catch(console.error);
        }}
      >
        <Search />
      </button>
    </search>
  );
}

export default SearchBar;
