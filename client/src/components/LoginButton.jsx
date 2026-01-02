import { UserCircle2 } from "lucide-react";
import { Link } from "react-router";

function LoginButton() {
  return (
    <Link
      to="/login"
      className="flex gap-2 items-center border border-fg/20 hover:bg-fg/20 py-1.5 px-3 rounded-full w-fit"
    >
      <UserCircle2 /> <span className="font-bold">Login</span>
    </Link>
  );
}

export default LoginButton;
