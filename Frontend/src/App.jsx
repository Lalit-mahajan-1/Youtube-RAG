import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./User/AuthContext";
import Register from "./User/Register";
import Login from "./User/Login";
import Home from "./Home";
import Chat from "./Page/Chat";
import Navbar from "./components/Navbar";

function AppRoutes() {
  const { isLoggedIn } = useContext(AuthContext);

  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-blue-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {isLoggedIn && <Navbar />}
      <div className={isLoggedIn ? "pt-16" : ""}>
        <Routes>
          <Route
            path="/login"
            element={!isLoggedIn ? <Login /> : <Navigate to="/home" />}
          />
          <Route
            path="/register"
            element={!isLoggedIn ? <Register /> : <Navigate to="/home" />}
          />
          <Route
            path="/home"
            element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/Chat/:id/:VideoId"
            element={isLoggedIn ? <Chat /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;