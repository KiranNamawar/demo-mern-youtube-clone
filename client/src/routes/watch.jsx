import { useLoaderData } from "react-router";
import api from "../lib/api";
import { formatNumber, timeAgo } from "../utils/format";
import VideoCard from "../components/VideoCard";
import { useScrollToTop } from "../hooks/scroll";
import VideoActions from "../components/VideoActions";
import VideoComments from "../components/VideoComments";

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
    <div>
      <div className="grid grid-cols-4 gap-2 p-2">
        <div className="col-span-3 flex flex-col gap-4">
          <iframe
            src={embedUrl}
            title={title}
            loading="lazy"
            allowFullScreen
            className="w-full aspect-video rounded-2xl"
          />
          <p className="text-2xl">{title}</p>
          <VideoActions channel={channelId} likes={likes} videoId={videoId} />
          <div className="overflow-hidden">
            <p className="flex gap-2">
              <span>{formatNumber(views)} views</span>
              <span>{timeAgo(createdAt)}</span>
            </p>
            <pre className="w-full">{description}</pre>
          </div>
          <VideoComments comments={comments} videoId={videoId} />
        </div>
        <div>
          {relatedVideos.map((video) => (
            <VideoCard video={video} key={video._id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Watch;
