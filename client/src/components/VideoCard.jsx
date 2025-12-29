import { formatDistanceToNow } from "date-fns";
import Avatar from "./Avatar";

const formatCompactNumber = (number) => {
  if (number < 1000) return number;
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);
};

function VideoCard({ video }) {
  const timeAgo = formatDistanceToNow(new Date(video.createdAt), {
    addSuffix: true,
  });
  return (
    <div className="">
      <img src={video.thumbnailUrl} alt={video.title} width={400} />
      <div className="flex">
        <Avatar
          src={video.channelId.avatar}
          alt={video.channelId.name}
          height={40}
          width={40}
        />
        <div className="overflow-hidden">
          <p className="text-ellipsis text-nowrap overflow-hidden">
            {video.title}
          </p>
          <p>{video.channelId.name}</p>
          <p>
            {formatCompactNumber(video.views)} views - {timeAgo}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
