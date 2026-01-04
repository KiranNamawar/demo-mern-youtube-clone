import { useLoaderData } from "react-router";
import api from "../lib/api";
import { formatNumber, timeAgo } from "../utils/format";
import VideoCard from "../components/VideoCard";
import { useScrollToTop } from "../hooks/scroll";
import VideoActions from "../components/VideoActions";
import VideoComments from "../components/VideoComments";
import { useState } from "react";
import clsx from "clsx";

export async function watchLoader({ params }) {
  try {
    const [videoRes] = await Promise.all([
      api.get(`/videos/${params.videoId}`), // get video data
      api.patch(`/videos/${params.videoId}/views`).catch(console.error), // increment view
    ]);
    return videoRes.data.data;
  } catch (err) {
    throw new Error(err.response.data.error);
  }
}

function Watch() {
  useScrollToTop();
  const data = useLoaderData();

  const [viewMoreDescription, setViewMoreDescription] = useState(false);

  const {
    _id: videoId,
    videoUrl,
    title,
    channelId,
    likes,
    views,
    createdAt,
    description,
    relatedVideos,
    comments,
  } = data;
  const embedUrl = videoUrl.replace("watch?v=", "embed/");

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 md:gap-4 p-1 md:p-2">
        {/* Main Video Section */}
        <div className="lg:col-span-3 flex flex-col gap-3 md:gap-4">
          <iframe
            src={embedUrl}
            title={title}
            loading="lazy"
            allowFullScreen
            className="w-full aspect-video rounded-xl md:rounded-2xl"
          />
          <p className="text-lg md:text-2xl font-semibold px-1">{title}</p>
          <VideoActions channel={channelId} likes={likes} videoId={videoId} />
          <div className="overflow-hidden bg-surface p-3 md:p-4 rounded-xl md:rounded-2xl flex flex-col">
            <p className="flex flex-wrap gap-2 md:gap-4 font-bold text-sm md:text-base">
              <span>{formatNumber(views)} views</span>
              <span>{timeAgo(createdAt)}</span>
            </p>
            <pre
              className={clsx("mt-2 transition-all duration-300 text-sm md:text-base whitespace-pre-wrap break-words", {
                "line-clamp-5": !viewMoreDescription,
              })}
            >
              {description}
            </pre>
            <button
              onClick={() => setViewMoreDescription(!viewMoreDescription)}
              className="font-semibold text-base md:text-lg self-end mt-2"
            >
              view {viewMoreDescription ? "less" : "more"}
            </button>
          </div>
          <VideoComments comments={comments} videoId={videoId} />
        </div>

        {/* Related Videos Section */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          {relatedVideos.map((video) => (
            <VideoCard video={video} key={video._id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Watch;
