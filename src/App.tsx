import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Vehicles from "./pages/Vehicles";
import Equipment from "./pages/Equipment";
import Loads from "./pages/Loads";
import Jobs from "./pages/Jobs";
import Services from "./pages/Services";
import SpareParts from "./pages/SpareParts";
import Finance from "./pages/Finance";
import Emergency from "./pages/Emergency";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import PostListing from "./pages/PostListing";
import ListingDetail from "./pages/ListingDetail";
import Favorites from "./pages/Favorites";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import CompleteProfile from "./pages/CompleteProfile";

import { useAuth } from "./contexts/AuthContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const isAuthenticated = !!user;

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-bg">
        <Header />

        <main className="flex-1">
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<Home />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/loads" element={<Loads />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/spare-parts" element={<SpareParts />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/listing/:id" element={<ListingDetail />} />

            {/* AUTH */}
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/" /> : <Login />
              }
            />

            <Route
              path="/register"
              element={
                isAuthenticated ? <Navigate to="/" /> : <Register />
              }
            />

            {/* PROTECTED */}
            <Route
              path="/complete-profile"
              element={
                <ProtectedRoute>
                  <CompleteProfile />
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

            <Route
              path="/post-listing"
              element={
                <ProtectedRoute>
                  <PostListing />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <Admin />
                </ProtectedRoute>
              }
            />

            <Route path="/favorites" element={<Favorites />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;