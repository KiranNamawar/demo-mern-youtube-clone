import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { useEffect } from "react";
import api from "../lib/api";
import { loginSuccess } from "../state/userSlice";
import { PlusIcon, User2Icon } from "lucide-react";
import Icon from "./Icon";

function User() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const isAuthenticated = !!user.accessToken;

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !isAuthenticated) {
      api
        .get("/api/me")
        .then((res) => {
          dispatch(loginSuccess({ ...res.data.data, accessToken }));
        })
        .catch(console.error);
    }
  }, [isAuthenticated]);

  return (
    <div className="flex items-center">
      {isAuthenticated ? (
        <>
          <button className="flex items-center">
            <PlusIcon />
            <span>Create</span>
          </button>
          <span className="flex items-center">
            <Icon
              src={user.avatar}
              alt={user.username}
              FallbackIcon={User2Icon}
            />
            <span>{user.username}</span>
          </span>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}

export default User;
