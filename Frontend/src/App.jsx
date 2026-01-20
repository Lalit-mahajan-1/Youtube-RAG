import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import Register from "./User/Register";
import Login from "./User/Login";
import Home from "./Home";
import { AuthProvider, AuthContext } from "./User/AuthContext";
import { useContext } from "react";

function AppRoutes() {
  const { isLoggedIn, user} = useContext(AuthContext);


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
      <Route
        path="/home"
        element={isLoggedIn ? <Home props={user}/> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
