import { createBrowserRouter } from "react-router";
import App from "./App";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./routes/home.jsx"));
const Register = lazy(() => import("./routes/register.jsx"));
const Login = lazy(() => import("./routes/login.jsx"));

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <Suspense>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <Suspense>
            <Register />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense>
            <Login />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
