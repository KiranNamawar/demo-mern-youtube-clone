import { Suspense, useState } from "react";
import { Outlet } from "react-router";
import Header from "./components/Header";
import SideBar from "./components/SideBar";

function App() {
  const [sideBarHidden, setSideBarHidden] = useState(false);
  const toggleSideBar = () => setSideBarHidden(!sideBarHidden);
  return (
    <div>
      <Header toggleSibeBar={toggleSideBar} />
      <div className="flex">
        {!sideBarHidden && <SideBar />}
        <main>
          {/* TODO: Add Loading component to Suspence */}
          <Suspense>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default App;
