import { useLoaderData, useSearchParams } from "react-router";
import VideoCard from "../components/VideoCard";
import api from "../lib/api";
import Button from "../components/Button";

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
    <div className="h-full">
      <div className="flex gap-3 p-2 pb-4 sticky top-14.5 bg-bg/95">
        {["All", ...categories].map((category) => (
          <Button
            key={category}
            active={activeCategory === category}
            onClick={() =>
              setSearchParams({ category: category === "All" ? "" : category })
            }
            title={category}
          />
        ))}
      </div>
      <div className="flex h-full justify-center">
        {videos.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {videos.map((video) => (
              <VideoCard video={video} key={video._id} />
            ))}
          </div>
        ) : (
          <div className="h-full flex justify-center items-center">
            <p className="font-semibold text-2xl">
              No videos found for "{searchParams.get("search")}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
