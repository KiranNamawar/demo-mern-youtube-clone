import { useState } from "react";
import { useLoaderData } from "react-router";
import Avatar from "../components/Avatar";
import SubscribeButton from "../components/SubscribeButton";
import VideoCard from "../components/VideoCard";
import api from "../lib/api";
import { formatNumber } from "../utils/format";

export async function channelLoader({ params }) {
  try {
    const res = api.get(`/channel/${params.channelId}`);
    return (await res).data.data;
  } catch (err) {
    const error = err.response.data.error;
    throw new Error(error);
  }
}

function Channel() {
  const {
    _id,
    name,
    handle,
    subscriberCount,
    videos,
    description,
    banner,
    avatar,
    createdAt,
  } = useLoaderData();

  const [bannerError, setBannerError] = useState(!banner);

  return (
    <div className="flex flex-col gap-4">
      {!bannerError && (
        <div className="w-full h-50 rounded-2xl overflow-hidden">
          <img
            src={banner}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setBannerError(true)}
          />
        </div>
      )}
      <div className="flex gap-4">
        <Avatar src={avatar} alt={name} width={150} height={150} />
        <div className="w-full flex flex-col gap-2">
          <h1 className="text-3xl">{name}</h1>
          <div className="flex gap-4">
            {handle && <span className="font-bold">@{handle}</span>}
            <span className="text-fg/70">
              {formatNumber(subscriberCount)} subscribers
            </span>
            <span className="text-fg/70">
              {formatNumber(videos.length)} videos
            </span>
          </div>
          <p className="line-clamp-1 overflow-hidden w-full text-fg/80">
            {description}
          </p>
          <SubscribeButton channel={{ _id, name, avatar }} />
        </div>
      </div>
      <div className="w-full border border-fg/20"></div>
      <div className="grid grid-cols-3">
        {videos.length > 0 ? (
          videos.map((video) => (
            <VideoCard
              video={{ ...video, channelId: { _id, name, avatar } }}
              key={video._id}
            />
          ))
        ) : (
          <p>No videos found</p>
        )}
      </div>
    </div>
  );
}

export default Channel;
