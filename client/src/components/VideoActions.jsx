import { useState } from "react";
import { useSelector } from "react-redux";
import {
  ArrowDownToLine,
  Ellipsis,
  Info,
  Send,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { formatNumber } from "../utils/format";
import Avatar from "./Avatar";
import api from "../lib/api";
import SubscribeButton from "./SubscribeButton";
import Button from "./Button";
import { Link } from "react-router";
import clsx from "clsx";
import toast from "react-hot-toast";

function VideoActions({ channel, likes, videoId }) {
  const isAuthenticated = useSelector((state) => !!state.user.accessToken);
  const likeButtonFillColor =
    useSelector((state) => state.theme) === "dark" ? "white" : "#212121";
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

  return (
    <div className="flex justify-between gap-4">
      <div className="flex gap-10 items-center">
        <div className="flex gap-3 items-center">
          <Avatar
            src={channel.avatar}
            alt={channel.name}
            width={40}
            height={40}
          />
          <div>
            <Link to={`/channel/${channel._id}`}>
              <p className="text-l font-medium">{channel.name}</p>
            </Link>
            <p className="text-fg/50 text-xs">
              {channel.subscribersCount} subscribers
            </p>
          </div>
        </div>
        <SubscribeButton channel={channel} />
      </div>
      <div className="flex gap-4 items-center">
        <span className="flex rounded-3xl bg-fg/10 overflow-hidden">
          <button
            className={clsx("flex gap-2 hover:bg-fg/20 px-4 py-2")}
            onClick={() => {
              isAuthenticated
                ? handleLike()
                : toast.error("Please Login to like video", { icon: <Info /> });
            }}
          >
            <ThumbsUp fill={likeState.isLiked ? likeButtonFillColor : "none"} />{" "}
            {formatNumber(likeState.likeCount)}
          </button>
          <div className="border m-0 my-2"></div>
          <button
            className={clsx("flex gap-2 hover:bg-fg/20 px-4 py-2")}
            onClick={() => {
              isAuthenticated
                ? handleDislike()
                : toast.error("Please Login to dislike video", {
                    icon: <Info />,
                  });
            }}
          >
            <ThumbsDown
              fill={likeState.isDisliked ? likeButtonFillColor : "none"}
            />
          </button>
        </span>

        {/* Static Buttons */}
        <Button Icon={Send} title="Share" className="rounded-3xl py-2" />
        <Button
          Icon={ArrowDownToLine}
          title="Download"
          className="rounded-3xl py-2"
        />
        <button className="rounded-full btn-secondary bg-fg/10">
          <Ellipsis />
        </button>
      </div>
    </div>
  );
}

export default VideoActions;
