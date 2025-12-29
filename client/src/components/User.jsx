import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { useEffect } from "react";
import { Plus, User2 } from "lucide-react";
import api from "../lib/api";
import { loginSuccess } from "../state/userSlice";
import Avatar from "./Avatar";

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
          <span className="flex items-center">
            <Avatar src={user.avatar} alt={user.username} />
            {/* <span>{user.username}</span> */}
          </span>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}

export default User;
