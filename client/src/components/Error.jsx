import { Link, useRouteError, isRouteErrorResponse } from "react-router";
import SearchBar from "./SearchBar";

function Error() {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const logo = mediaQuery.matches ? "/logo_white.png" : "/logo_black.png";

  const error = useRouteError();
  console.log(error);
  return (
    <main className="w-full h-full flex flex-col justify-center items-center min-h-screen">
      <div>
        {isRouteErrorResponse(error) ? (
          <p>{error.data}</p>
        ) : (
          <p>{error.message}</p>
        )}
      </div>
      <Link to="/">
        <img src={logo} alt="YouTube Logo" width={300} />
      </Link>
    </main>
  );
}

export default Error;
