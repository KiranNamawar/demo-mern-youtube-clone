import { LogOut, Plus, TvMinimal, Video } from "lucide-react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../lib/api";
import { loginSuccess, logoutSuccess } from "../state/userSlice";
import Avatar from "./Avatar";
import LoginButton from "./LoginButton";
import Button from "./Button";
import ChannelDialog from "./ChannelDialog";
import VideoDialog from "./VideoDialog";
import toast from "react-hot-toast";
import { Link } from "react-router";

function User() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const isAuthenticated = !!user.accessToken;

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !isAuthenticated) {
      api
        .get("/me")
        .then((res) => {
          dispatch(loginSuccess({ ...res.data.data, accessToken }));
        })
        .catch(console.error);
    }
  }, [isAuthenticated]);

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated ? (
        <>
          <Button popoverTarget="create-box" Icon={Plus} title="Create" />
          <div
            id="create-box"
            popover="auto"
            className="fixed top-14 right-4 m-0 left-auto min-w-55 p-4 rounded-xl bg-surface"
          >
            <div className="flex flex-col items-center gap-4">
              <ChannelDialog />
              <VideoDialog />
            </div>
          </div>
          <button popoverTarget="user-profile" className="cursor-pointer">
            <Avatar
              src={user.avatar}
              alt={user.username}
              height={30}
              width={30}
            />
          </button>
          <div
            popover="auto"
            id="user-profile"
            className="fixed top-14 right-4 m-0 left-auto min-w-60 p-4 rounded-xl bg-surface"
          >
            <div className="flex flex-col items-center gap-3 justify-between">
              <Avatar
                src={user.avatar}
                alt={user.username}
                width={50}
                height={50}
              />
              <div className="text-center">
                <p className="font-bold">{user.email}</p>
                <p className="text-fg/50">{user.username}</p>
              </div>
              <div className="border w-full border-fg/20"></div>
              <div className="flex flex-col items-center gap-2">
                <h3 className="text-xl font-semibold">My Channels</h3>
                {user.channels.length > 0 ? (
                  <div>
                    {user.channels.map((chan) => (
                      <Link
                        key={chan._id}
                        to={`/channel/${chan._id}`}
                        className="flex gap-2 btn-secondary"
                      >
                        <Avatar src={chan.avatar} alt={chan.name} />
                        <span>{chan.name}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p>No Channels found</p>
                )}
              </div>
              <div className="border w-full border-fg/20"></div>
              <Button
                onClick={() => {
                  dispatch(logoutSuccess());
                  toast.success("Logout Successful");
                }}
                Icon={LogOut}
                title="Logout"
              />
            </div>
          </div>
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
}

export default User;
