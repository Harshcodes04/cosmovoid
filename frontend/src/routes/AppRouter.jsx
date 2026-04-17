import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../pages/Home";
import Explore from "../pages/Explore";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Journal from "../pages/Journal";
import JournalCreate from "../pages/JournalCreate";
import JournalDetails from "../pages/JournalDetails";
import Launches from "../pages/Launches";
import LaunchDetails from "../pages/LaunchDetails";
import Gallery from "../pages/Gallery";
import Rockets from "../pages/Rockets";
import RocketDetails from "../pages/RocketDetails";
import Crew from "../pages/Crew";
import CrewDetails from "../pages/CrewDetails";
import Launchpads from "../pages/Launchpads";
import Landpads from "../pages/Landpads";
import Roadster from "../pages/Roadster";
import Asteroids from "../pages/Asteroids";
import News from "../pages/News";
import Events from "../pages/Events";
import Search from "../pages/Search";
import NotFound from "../pages/NotFound";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
        }
      />
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
        path="/journal/:id"
        element={
          <ProtectedRoute>
            <JournalDetails />
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
        path="/launches/:id"
        element={
          <ProtectedRoute>
            <LaunchDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rockets"
        element={
          <ProtectedRoute>
            <Rockets />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rockets/:id"
        element={
          <ProtectedRoute>
            <RocketDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crew"
        element={
          <ProtectedRoute>
            <Crew />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crew/:id"
        element={
          <ProtectedRoute>
            <CrewDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/launchpads"
        element={
          <ProtectedRoute>
            <Launchpads />
          </ProtectedRoute>
        }
      />
      <Route
        path="/landpads"
        element={
          <ProtectedRoute>
            <Landpads />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roadster"
        element={
          <ProtectedRoute>
            <Roadster />
          </ProtectedRoute>
        }
      />
      <Route
        path="/asteroids"
        element={
          <ProtectedRoute>
            <Asteroids />
          </ProtectedRoute>
        }
      />
      <Route
        path="/news"
        element={
          <ProtectedRoute>
            <News />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Search />
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
