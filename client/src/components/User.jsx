import { LogOut, Plus, Tv, TvMinimal, Video } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../lib/api";
import { loginSuccess, logoutSuccess } from "../state/userSlice";
import Avatar from "./Avatar";
import LoginButton from "./LoginButton";
import Button from "./Button";

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

  console.log(user);
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
              <Button Icon={TvMinimal} title="Create Channel" />
              <Button
                disabled={user.channels.length === 0}
                Icon={Video}
                title="Upload Video"
              />
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
            <div className="flex flex-col items-center gap-4 justify-between">
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
              <Button
                onClick={() => dispatch(logoutSuccess())}
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
