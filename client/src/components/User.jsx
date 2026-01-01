import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../lib/api";
import { loginSuccess } from "../state/userSlice";
import Avatar from "./Avatar";
import LoginButton from "./LoginButton";

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
    <div className="flex items-center">
      {isAuthenticated ? (
        <>
          <button className="flex items-center">
            <Plus />
            <span>Create</span>
          </button>
          <Avatar src={user.avatar} alt={user.username} />
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
}

export default User;
