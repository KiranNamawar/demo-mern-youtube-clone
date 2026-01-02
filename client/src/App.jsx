import { Suspense, useState } from "react";
import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import clsx from "clsx";

function App() {
  const [sideBarHidden, setSideBarHidden] = useState(false);
  const toggleSideBar = () => setSideBarHidden(!sideBarHidden);
  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSideBar={toggleSideBar} />
      <div className="flex">
        <aside
          className={clsx(
            "transition-all ease-in-out duration-300 scroll-auto",
            sideBarHidden ? "w-0 opacity-0" : "w-50 opacity-100"
          )}
        >
          <SideBar hidden={sideBarHidden} />
        </aside>
        <main className="flex-1">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--bg-color-inverse)",
            color: "var(--fg-color-inverse)",
          },
          success: {
            icon: <CheckCircle className="text-green-500" size={20} />,
          },
          error: {
            icon: <AlertCircle className="text-red-500" size={20} />,
          },
          loading: {
            icon: <Loader2 className="animate-spin text-blue-500" size={20} />,
          },
        }}
      />
    </div>
  );
}

function Loading() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  );
}

export default App;
