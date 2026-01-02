import { useSelector } from "react-redux";
import { Link } from "react-router";

function Logo() {
  const theme = useSelector((state) => state.theme);
  const logo = theme === "dark" ? "/logo_white.png" : "/logo_black.png";
  return (
    <Link to="/">
      <img src={logo} alt="YouTube Logo" width={125} />
    </Link>
  );
}

export default Logo;
