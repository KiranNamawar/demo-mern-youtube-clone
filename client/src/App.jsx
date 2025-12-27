import { Outlet } from "react-router";
import Header from "./components/Header";

function App() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <footer>Footer</footer>
    </div>
  );
}

export default App;
