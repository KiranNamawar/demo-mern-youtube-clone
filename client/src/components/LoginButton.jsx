import { UserCircle2 } from "lucide-react";
import { Link } from "react-router";

function LoginButton() {
  return (
    <Link
      to="/login"
      className="flex gap-2 items-center border p-2 rounded-full w-fit"
    >
      <UserCircle2 /> <span>Login</span>
    </Link>
  );
}

export default LoginButton;
