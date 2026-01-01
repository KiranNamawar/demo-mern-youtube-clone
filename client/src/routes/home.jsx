import { useLoaderData, useSearchParams } from "react-router";
import clsx from "clsx";
import api from "../lib/api";
import VideoCard from "../components/VideoCard";

export async function homeLoader({ request }) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const category = url.searchParams.get("category") || "";

  let videosEndpoint = "/videos?";
  if (category) videosEndpoint += `category=${encodeURIComponent(category)}&`;
  if (search) videosEndpoint += `search=${encodeURIComponent(search)}`;

  const [categoriesRes, videosRes] = await Promise.all([
    api.get("/videos/categories"),
    api.get(videosEndpoint),
  ]);

  return {
    categories: categoriesRes.data.data,
    videos: videosRes.data.data,
  };
}

function Home() {
  const { categories, videos } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";

  return (
    <div>
      <div className="flex gap-3 m-2">
        {["All", ...categories].map((category) => (
          <button
            key={category}
            className={clsx(
              activeCategory === category && "active",
              "btn"
            )}
            onClick={() =>
              setSearchParams({ category: category === "All" ? "" : category })
            }
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3">
        {videos.length > 0 ? (
          videos.map((video) => <VideoCard video={video} key={video._id} />)
        ) : (
          <p>No videos found for term "{searchParams.get("search")}"</p>
        )}
      </div>
    </div>
  );
}

export default Home;
