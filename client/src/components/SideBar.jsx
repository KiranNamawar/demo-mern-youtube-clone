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
import { Link } from "react-router";
import Avatar from "./Avatar";
import LoginButton from "./LoginButton";

function SideBar() {
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
    <div>
      <div>
        <Link to="/" className="flex">
          <Home /> <span>Home</span>
        </Link>
        <div className="flex">
          <SmartphoneCharging /> <span>Shorts</span>
        </div>
      </div>
      <br />
      <div>
        {isAuthenticated ? (
          <div>
            <div className="flex">
              <span>Subscriptions</span>
              <ChevronRight />
            </div>
            {subscriptions.length > 0 ? (
              subscriptions.map(({ _id, name, avatar }) => (
                <Link to={`/channel/${_id}`}>
                  <Avatar src={avatar} alt={name} />
                  <span>{name}</span>
                </Link>
              ))
            ) : (
              <p>No Subscriptions Available </p>
            )}
          </div>
        ) : (
          <div>
            <p>Login to like videos, comment, and subscribe.</p>
            <LoginButton />
          </div>
        )}
      </div>
      <br />
      <div>
        <div className="flex">
          <span>You</span> <ChevronRight />
        </div>
        {youSectionItems.map(({ title, Icon }) => (
          <div key={title} className="flex">
            <Icon />
            <span>{title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideBar;
