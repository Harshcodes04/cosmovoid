import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Journal from "../pages/Journal";
import Launches from "../pages/Launches";
import Gallery from "../pages/Gallery";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal"
        element={
          <ProtectedRoute>
            <Journal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/launches"
        element={
          <ProtectedRoute>
            <Launches />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gallery"
        element={
          <ProtectedRoute>
            <Gallery />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
