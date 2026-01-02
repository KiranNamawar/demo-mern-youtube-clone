import Avatar from "./Avatar";
import { Link } from "react-router";
import { formatNumber, timeAgo } from "../utils/format";

function VideoCard({ video }) {
  return (
    <div className="rounded-2xl overflow-hidden">
      <Link to={`/watch/${video._id}`}>
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          width={400}
          loading="lazy"
        />
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
              {formatNumber(video.views)} views - {timeAgo(video.createdAt)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default VideoCard;
