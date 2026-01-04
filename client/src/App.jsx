import { Suspense, useEffect, useState } from "react";
import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import Header from "./components/Header";
import SideBar from "./components/SideBar";

function App() {
  const [sideBarHidden, setSideBarHidden] = useState(false);

  const toggleSideBar = () => setSideBarHidden(!sideBarHidden);

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSideBar={toggleSideBar} />
      <div className="flex relative">
        <aside className={`lg:transition-all lg:ease-in-out lg:duration-300 ${sideBarHidden ? 'lg:w-0' : 'lg:w-60'}`}>
          <SideBar hidden={sideBarHidden} />
        </aside>
        <main className="flex-1 p-2 md:p-4 min-w-0 transition-all duration-300">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
          <div className="h-6"></div>
        </main>
      </div>
      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: "var(--color-bg-inverse)",
            color: "var(--color-fg-inverse)",
            fontWeight: "bold",
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
