import Navbar from "./Components/Header/navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Components/Footer/footer";
import { Toaster } from "react-hot-toast";

function layout() {
  return (
    <>
      <header>
        <Navbar />
        <Toaster />
      </header>

      <main >
        <Outlet />
      </main >
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default layout;
