import { useLoaderData, useSearchParams } from "react-router";
import api from "../lib/api";
import VideoCard from "../components/VideoCard";

export async function homeLoader({ request }) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const category = url.searchParams.get("category") || "";

  try {
    let videosEndpoint = "/videos?";
    if (category) videosEndpoint += `category=${encodeURIComponent(category)}&`;
    if (search) videosEndpoint += `search=${encodeURIComponent(search)}`;

    const [categoriesRes, videosRes] = await Promise.all([
      api.get("/videos/categories"),
      api.get(videosEndpoint),
    ]);
    return {
      success: true,
      categories: categoriesRes.data.data,
      videos: videosRes.data.data,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: err?.response?.data?.error || "Something went wrong",
    };
  }
}

function Home() {
  const { success, categories, videos, error } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";

  if (!success) return <p>{error}</p>;

  return (
    <div>
      <div className="flex gap-3 m-2">
        {["All", ...categories].map((category) => (
          <button
            key={category}
            className={activeCategory === category ? "font-bold underline" : ""}
            onClick={() =>
              setSearchParams({ category: category === "All" ? "" : category })
            }
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
