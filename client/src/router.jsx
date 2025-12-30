import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import App from "./App";
import { homeLoader } from "./routes/home.jsx";
import { watchLoader } from "./routes/watch.jsx";

const Home = lazy(() => import("./routes/home.jsx"));
const Register = lazy(() => import("./routes/register.jsx"));
const Login = lazy(() => import("./routes/login.jsx"));
const Watch = lazy(() => import("./routes/watch.jsx"));

// Suspence added in App.jsx for all routes
const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        loader: homeLoader,
        Component: Home,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/watch/:videoId",
        loader: watchLoader,
        Component: Watch,
      },
    ],
  },
]);

export default router;
