import { Suspense } from "react";
import { Outlet } from "react-router";
import Header from "./components/Header";

function App() {
  return (
    <div>
      <Header />
      <main>
        {/* TODO: Add Loading component to Suspence */}
        <Suspense>
          <Outlet />
        </Suspense>
      </main>
      <footer>Footer</footer>
    </div>
  );
}

export default App;
