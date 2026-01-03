import { useState } from "react";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import Avatar from "../components/Avatar";
import SubscribeButton from "../components/SubscribeButton";
import VideoCard from "../components/VideoCard";
import api from "../lib/api";
import { formatNumber } from "../utils/format";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ChannelDialog from "../components/ChannelDialog";
import Button from "../components/Button";
import { Trash2 } from "lucide-react";
import { removeChannel } from "../state/userSlice";
import VideoDialog from "../components/VideoDialog";

export async function channelLoader({ params }) {
  try {
    const res = await api.get(`/channel/${params.channelId}`);
    return res.data.data;
  } catch (err) {
    const error = err.response.data.error;
    throw new Error(error);
  }
}

function Channel() {
  const channel = useLoaderData();
  const {
    userId,
    _id,
    name,
    handle,
    subscriberCount,
    videos,
    description,
    banner,
    avatar,
  } = channel;

  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const isAuthenticated = !!user.accessToken;
  const isOwner = isAuthenticated && user.id === userId;

  function handleVideoDelete(videoId) {
    api
      .delete(`/channel/${_id}/video/${videoId}`)
      .then((res) => {
        revalidator.revalidate();
        toast.success(res.data.message);
      })
      .catch((err) => toast.error(err.response.data.error));
  }

  function handleChannelDelete() {
    api
      .delete(`/channel/${_id}`)
      .then((res) => {
        dispatch(removeChannel(_id));
        toast.success(res.data.message);
        navigate("/");
      })
      .catch((err) => toast.error(err.response.data.error));
  }

  const backupBannerUrl = `https://picsum.photos/seed/${name}/800/200`;

  return (
    <div className="flex flex-col gap-4 min-h-screen p-2">
      <div className="w-full h-50 rounded-2xl overflow-hidden">
        <img
          src={banner ?? backupBannerUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(evt) => (evt.currentTarget.src = backupBannerUrl)}
        />
      </div>
      <div className="flex gap-4">
        <Avatar src={avatar} alt={name} width={150} height={150} />
        <div className="w-full flex flex-col gap-2">
          <h1 className="text-3xl">{name}</h1>
          <div className="flex gap-4">
            <span className="font-bold">
              {handle?.startsWith("@") ? handle : "@" + handle}
            </span>
            <span className="text-fg/70">
              {formatNumber(subscriberCount)} subscribers
            </span>
            <span className="text-fg/70">
              {formatNumber(videos.length)} videos
            </span>
          </div>
          <p className="line-clamp-2 overflow-hidden w-full text-fg/80 max-w-4xl">
            {description}
          </p>
          {isOwner ? (
            <div className="flex gap-4 items-center">
              <ChannelDialog edit={true} channel={channel} />
              <Button
                Icon={Trash2}
                title="Delete Channel"
                onClick={handleChannelDelete}
              />
            </div>
          ) : (
            <SubscribeButton channel={{ _id, name, avatar }} />
          )}
        </div>
      </div>
      <div className="w-full border border-fg/20 mt-4 mx-2 m-auto"></div>
      <div className="flex flex-1 h-full">
        {videos.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {videos.map((video) => (
              <VideoCard
                video={{ ...video, channelId: { _id, name, avatar } }}
                key={video._id}
                isOwner={isOwner}
                onDelete={() => handleVideoDelete(video._id)}
                channelId={_id}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center w-full h-full justify-center">
            {isOwner ? (
              <div className="flex flex-col items-center gap-4">
                <p>You haven't uploaded any video yet.</p>
                <VideoDialog channelId={_id} />
              </div>
            ) : (
              <p>No videos found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Channel;
