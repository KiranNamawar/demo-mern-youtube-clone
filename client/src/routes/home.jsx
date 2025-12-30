import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import api from "../lib/api";
import VideoCard from "../components/VideoCard";
import { setVideos } from "../state/videosSlice";

export async function homeLoader() {
  let categories = [];
  try {
    const res = await api.get("/videos/categories");
    categories = res.data.data;
  } catch (err) {
    console.error(err);
  }
  return { categories };
}

function Home() {
  const videos = useSelector((state) => state.videos);
  const { categories } = useLoaderData();
  const [activeCategory, setActiveCategory] = useState("All");

  const dispatch = useDispatch();

  useEffect(() => {
    api
      .get(
        `/videos?category=${
          activeCategory === "All" ? "" : encodeURIComponent(activeCategory)
        }`
      )
      .then((res) => dispatch(setVideos(res.data.data)))
      .catch(console.error);
  }, [activeCategory]);

  return (
    <div>
      <div className="flex gap-3">
        {["All", ...categories].map((category) => (
          <button
            className="border"
            onClick={() => setActiveCategory(category)}
            key={category}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3">
        {videos.map((video) => (
          <VideoCard video={video} key={video._id} />
        ))}
      </div>
    </div>
  );
}

export default Home;
