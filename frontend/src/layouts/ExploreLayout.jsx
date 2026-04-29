import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";

const ExploreLayout = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <Outlet />
    </>
  );
};

export default ExploreLayout;
