import {
  ChevronRight,
  Clock,
  History,
  Home,
  ListVideo,
  SmartphoneCharging,
  SquarePlay,
  ThumbsUp,
} from "lucide-react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router";
import Avatar from "./Avatar";
import LoginButton from "./LoginButton";
import clsx from "clsx";

function SideBar({ hidden }) {
  const subscriptions = useSelector((state) => state.user.subscriptions);
  const isAuthenticated = useSelector((state) => !!state.user.accessToken);

  const youSectionItems = [
    { title: "History", Icon: History },
    { title: "Playlist", Icon: ListVideo },
    { title: "Watch Later", Icon: Clock },
    { title: "Liked Videos", Icon: ThumbsUp },
    { title: "Your Videos", Icon: SquarePlay },
  ];

  return (
    <>
      <div
        className={clsx(
          "hidden lg:flex flex-col w-60 transition-all duration-300 bg-bg overflow-y-auto",
          "sticky top-16 min-h-[calc(100vh-64px)] p-4",
          hidden && "opacity-0 invisible",
        )}
      >
        <div className="flex flex-col gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-2 hover:bg-fg/20 p-2 rounded-xl",
                isActive && "bg-surface",
              )
            }
          >
            <Home /> <span>Home</span>
          </NavLink>
          <div className="flex items-center gap-2 p-2">
            <SmartphoneCharging /> <span>Shorts</span>
          </div>
        </div>
        <div className="border border-fg/50 my-4"></div>
        <div className="flex flex-col gap-2">
          <div className="flex">
            <span className="font-bold">Subscriptions</span>
            <ChevronRight />
          </div>
          {isAuthenticated ? (
            <div className="flex flex-col gap-1">
              {subscriptions.length > 0 ? (
                subscriptions.map(({ _id, name, avatar }) => (
                  <NavLink
                    key={_id}
                    to={`/channel/${_id}`}
                    className={({ isActive }) =>
                      clsx(
                        "grid grid-cols-5 gap-2 hover:bg-fg/20 p-2 rounded-xl",
                        isActive && "bg-surface",
                      )
                    }
                  >
                    <Avatar
                      src={avatar}
                      alt={name}
                      className="h-full col-span-1"
                    />
                    <span className="overflow-x-hidden text-nowrap col-span-4 text-ellipsis">
                      {name}
                    </span>
                  </NavLink>
                ))
              ) : (
                <p className="p-2">No Subscriptions Available </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-2">
              <p>Login to subscribe</p>
              <LoginButton />
            </div>
          )}
        </div>
        <div className="border border-fg/50 my-4"></div>
        <div className="flex flex-col gap-1">
          <div className="flex">
            <span className="font-bold">You</span> <ChevronRight />
          </div>
          {youSectionItems.map(({ title, Icon }) => (
            <div key={title} className="flex items-center gap-2 p-2">
              <Icon />
              <span>{title}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SideBar;
