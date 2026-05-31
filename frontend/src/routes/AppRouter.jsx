import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import ExploreLayout from "../layouts/ExploreLayout";

import Home from "../pages/Home";
import Explore from "../pages/Explore";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Journal from "../pages/Journal";
import JournalCreate from "../pages/JournalCreate";
import JournalEdit from "../pages/JournalEdit";
import JournalDetails from "../pages/JournalDetails";
import Launches from "../pages/Launches";
import LaunchDetails from "../pages/LaunchDetails";
import Gallery from "../pages/Gallery";
import Rockets from "../pages/Rockets";
import RocketDetails from "../pages/RocketDetails";
import Crew from "../pages/Crew";
import CrewDetails from "../pages/CrewDetails";
import Asteroids from "../pages/Asteroids";
import News from "../pages/News";
import Events from "../pages/Events";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Terms from "../pages/Terms";
import NotFound from "../pages/NotFound";
import ForgotPassword from "../pages/ForgotPassword";
import Profile from "../pages/Profile";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={<ExploreLayout />}>
        <Route path="/explore" element={<Explore />} />
        <Route path="/launches" element={<Launches />} />
        <Route path="/launches/:id" element={<LaunchDetails />} />
        <Route path="/rockets" element={<Rockets />} />
        <Route path="/rockets/:id" element={<RocketDetails />} />
        <Route path="/crew" element={<Crew />} />
        <Route path="/crew/:id" element={<CrewDetails />} />
        <Route path="/asteroids" element={<Asteroids />} />
        <Route path="/news" element={<News />} />
        <Route path="/events" element={<Events />} />

        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
      </Route>
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
        path="/journal/new"
        element={
          <ProtectedRoute>
            <JournalCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal/:id/edit"
        element={
          <ProtectedRoute>
            <JournalEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal/:id"
        element={
          <ProtectedRoute>
            <JournalDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
