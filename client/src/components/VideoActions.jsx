import { useState } from "react";
import { useSelector } from "react-redux";
import {
  ArrowDownToLine,
  Ellipsis,
  Send,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { formatNumber } from "../utils/format";
import Avatar from "./Avatar";
import api from "../lib/api";
import SubscribeButton from "./SubscribeButton";

function VideoActions({ channel, likes, videoId }) {
  const isAuthenticated = useSelector((state) => !!state.user.accessToken);
  const [likeState, setLikeState] = useState({
    isLiked: false,
    isDisliked: false,
    likeCount: likes || 0,
  });

  const likeEndpoint = `/videos/${videoId}/likes?dec=`;

  async function handleLike() {
    const prevState = { ...likeState };
    const wasLiked = likeState.isLiked;

    // Optimistically update local UI
    setLikeState({
      isLiked: !wasLiked,
      isDisliked: false, // Ensure dislike is cleared when liking
      likeCount: wasLiked
        ? Math.max(0, likeState.likeCount - 1)
        : likeState.likeCount + 1,
    });

    // Sync with server: dec=true if unliking, dec=false if liking
    api
      .patch(`${likeEndpoint}${wasLiked}`)
      .catch(() => setLikeState(prevState)); // Revert on failure
  }

  async function handleDislike() {
    const prevState = { ...likeState };
    const wasLiked = likeState.isLiked;
    const wasDisliked = likeState.isDisliked;

    // Local-only visual toggle for dislike
    setLikeState({
      isDisliked: !wasDisliked,
      isLiked: false, // Ensure like is cleared when disliking
      likeCount: wasLiked
        ? Math.max(0, likeState.likeCount - 1)
        : likeState.likeCount,
    });

    // Only hit server if we need to remove an existing Like
    if (wasLiked) {
      api.patch(`${likeEndpoint}true`).catch(() => setLikeState(prevState));
    }
  }
  console.log(likeState);

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Avatar src={channel.avatar} alt={channel.name} />
        <div>
          <p>{channel.name}</p>
          <p>{channel.subscribersCount} subscribers</p>
        </div>
        <SubscribeButton channel={channel} />
      </div>
      <div className="flex gap-2 items-center">
        <span className="flex gap-2">
          <button
            className="flex gap-2"
            onClick={() =>
              // TODO: ask to login if unauthenticated
              isAuthenticated && handleLike()
            }
          >
            <ThumbsUp /> {formatNumber(likeState.likeCount)}
          </button>
          <button
            className="flex gap-2"
            onClick={() =>
              // TODO: ask to login if unauthenticated
              isAuthenticated && handleDislike()
            }
          >
            <ThumbsDown />
          </button>
        </span>

        {/* Static Buttons */}
        <button className="flex gap-2">
          <Send /> <span>Share</span>
        </button>
        <button className="flex gap-2">
          <ArrowDownToLine /> <span>Download</span>
        </button>
        <button className="rounded-full">
          <Ellipsis />
        </button>
      </div>
    </div>
  );
}

export default VideoActions;
