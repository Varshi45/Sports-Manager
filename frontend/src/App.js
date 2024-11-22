import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalProvider } from "./context/Globalcontext";
import ProtectedRoute from "./ProtectedRoute";
import SignUp from "./auth/SignUp";
import Login from "./auth/Login";
import Home from "./auth/Home";
import PlayerDashboard from "./player/Dashboard";
import AdminDashboard from "./admin/Dashboard";
import AdminProfile from "./admin/Profile";
import AdminAnalysis from "./admin/AdminAnalysis";
import CreateSportForm from "./admin/CreateSportForm";
import CreateMatchForm from "./admin/CreateMatch";
import PlayersInMatch from "./player/PlayersInMatch";
import PlayerMatches from "./player/PlayerMatches";
import PlayerProfile from "./player/PlayerProfile";

function App() {
  return (
    <GlobalProvider>
      <Router>
        <div className="App flex items-center justify-center h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/create-sport"
              element={
                <ProtectedRoute>
                  <CreateSportForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/create-match"
              element={
                <ProtectedRoute>
                  <CreateMatchForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/player/dashboard"
              element={
                <ProtectedRoute>
                  <PlayerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard/profile"
              element={
                <ProtectedRoute>
                  <AdminProfile />
                </ProtectedRoute>
              }
            />
            {/* Dynamic route for players in a match */}
            <Route
              path="/match/:matchId/players"
              element={
                <ProtectedRoute>
                  <PlayersInMatch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/player/joined-matches"
              element={
                <ProtectedRoute>
                  <PlayerMatches />
                </ProtectedRoute>
              }
            />
            <Route
              path="/player/dashboard/profile"
              element={
                <ProtectedRoute>
                  <PlayerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analysis"
              element={
                <ProtectedRoute>
                  <AdminAnalysis />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </GlobalProvider>
  );
}

export default App;
