import Avatar from "./Avatar";
import { useNavigate } from "react-router";
import { formatNumber, timeAgo } from "../utils/format";
import Button from "./Button";
import { Trash2 } from "lucide-react";
import VideoDialog from "./VideoDialog";

function VideoCard({ video, isOwner = false, onDelete, channelId }) {
  const navigate = useNavigate();

  const backThumbnailUrl = `https://picsum.photos/seed/${video.title}/300/200`;

  return (
    <div>
      <div
        className="rounded-2xl overflow-hidden grid gap-2 cursor-pointer"
        onClick={() => navigate(`/watch/${video._id}`)}
      >
        <img
          src={video.thumbnailUrl ?? backThumbnailUrl}
          alt={video.title}
          width={400}
          loading="lazy"
          onError={(evt) => (evt.currentTarget.src = backThumbnailUrl)}
        />
        <div className="flex justify-between gap-2">
          <Avatar
            src={video.channelId.avatar}
            alt={video.channelId.name}
            height={40}
            width={40}
          />
          <div className="overflow-hidden flex-1">
            <p className="truncate font-bold">{video.title}</p>
            <p className="text-fg/70">{video.channelId.name}</p>
            <p className="text-fg/70">
              {formatNumber(video.views)} views - {timeAgo(video.createdAt)}
            </p>
          </div>
        </div>
      </div>
      {isOwner && (
        <div className="flex items-center justify-between">
          <VideoDialog edit={true} video={video} channelId={channelId} />
          <Button
            Icon={Trash2}
            title="Delete Video"
            onClick={(evt) => {
              evt.stopPropagation();
              onDelete();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default VideoCard;
