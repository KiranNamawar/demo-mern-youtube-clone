import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import ChannelDialog from "../components/ChannelDialog";
import SubscribeButton from "../components/SubscribeButton";
import VideoCard from "../components/VideoCard";
import VideoDialog from "../components/VideoDialog";
import api from "../lib/api";
import { removeChannel } from "../state/userSlice";
import { formatNumber } from "../utils/format";

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
    <div className="flex flex-col gap-3 md:gap-4 min-h-screen p-1 md:p-2">
      {/* Channel Banner */}
      <div className="w-full h-32 md:h-40 lg:h-50 rounded-xl md:rounded-2xl overflow-hidden">
        <img
          src={banner ?? backupBannerUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(evt) => (evt.currentTarget.src = backupBannerUrl)}
        />
      </div>

      {/* Channel Info Section */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 px-2">
        {/* Avatar */}
        <Avatar
          src={avatar}
          alt={name}
          width={80}
          height={80}
          className="md:w-30 md:h-30 lg:w-37.5 lg:h-37.5"
        />
        <div className="w-full flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
          <div className="flex flex-wrap gap-2 md:gap-4 text-sm md:text-base">
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
          <p className="line-clamp-2 overflow-hidden w-full text-fg/80 max-w-4xl text-sm md:text-base">
            {description}
          </p>
          {isOwner ? (
            <div className="flex flex-wrap gap-2 md:gap-4 items-center">
              <ChannelDialog edit={true} channel={channel} />
              <Button
                Icon={Trash2}
                title="Delete"
                onClick={handleChannelDelete}
              />
            </div>
          ) : (
            <SubscribeButton channel={{ _id, name, avatar }} />
          )}
        </div>
      </div>

      <div className="w-full border border-fg/20 mt-2 md:mt-4 mx-2 m-auto"></div>

      {/* Videos Grid */}
      <div className="flex flex-1 h-full px-1">
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 w-full">
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
              <div className="flex flex-col items-center gap-4 p-4">
                <p className="text-center">You haven't uploaded any video yet.</p>
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
