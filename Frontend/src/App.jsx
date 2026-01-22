import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useContext } from "react";

import Register from "./User/Register";
import Login from "./User/Login";
import Home from "./Home";
import { AuthProvider, AuthContext } from "./User/AuthContext";

function AppRoutes() {
  const { isLoggedIn } = useContext(AuthContext);

  // 🔴 VERY IMPORTANT: wait for auth check to finish
  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={!isLoggedIn ? <Login /> : <Navigate to="/home" />}
      />

      <Route
        path="/register"
        element={!isLoggedIn ? <Register /> : <Navigate to="/home" />}
      />

      {/* protected routes */}
      <Route
        path="/home"
        element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
      />

      <Route
        path="/home/:id"
        element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
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
