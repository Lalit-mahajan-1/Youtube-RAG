// components/Navbar.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../User/AuthContext";
import { useNavigate } from "react-router";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Drawer,
  Divider,
} from "@mui/material";
import {
  VideoLibrary,
  Logout,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import UserChat from "../Page/UserChat";
import { Link } from "react-router";
import axios from "axios";

const MotionAppBar = motion.create(AppBar);

function Navbar() {
  const { User, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!User) return null;

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/logout`, {},
        { withCredentials: true });
      navigate("/login");
    } catch (error) {
      console.log(error)
    }
  };

  const toggleDrawer = (value) => () => setOpen(value);

  return (
    <>
      <MotionAppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "#020617",
          borderBottom: "1px solid #111827",
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Toolbar sx={{ minHeight: 64, px: { xs: 2, sm: 3, md: 6 } }}>
          {/* Left side: menu + logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexGrow: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{
                mr: 1,
                borderRadius: 2,
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: 2,
                  bgcolor: "#1d4ed8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <VideoLibrary sx={{ fontSize: 20, color: "#e5e7eb" }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#e5e7eb",
                  letterSpacing: 0.3,
                }}
              >
                <Link to="/home"> VideoChat</Link>
              </Typography>
            </Box>
          </Box>

          {/* Right side: user + logout */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#e5e7eb", fontWeight: 500 }}
              >
                {User.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                {User.email}
              </Typography>
            </Box>

            <Avatar
              sx={{
                bgcolor: "#1d4ed8",
                color: "#e5e7eb",
              }}
            >
              {User.name?.[0]?.toUpperCase() ?? "U"}
            </Avatar>

            <IconButton
              onClick={handleLogout}
              sx={{
                ml: 0.5,
                borderRadius: 2,
                px: 2,
                color: "#e5e7eb",
              }}
            >
              <Logout sx={{ fontSize: 20 }} />
              <Typography
                variant="button"
                sx={{
                  ml: 1,
                  textTransform: "none",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Logout
              </Typography>
            </IconButton>
          </Box>
        </Toolbar>
      </MotionAppBar>

      {/* Sidebar drawer with chats */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: "#020617",
            borderRight: "1px solid #111827",
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ p: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                textTransform: "uppercase",
                letterSpacing: 1.5,
                fontSize: 11,
                color: "#6b7280",
              }}
            >
              Chats
            </Typography>

          </Box>
          <Divider sx={{ borderColor: "#111827" }} />

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            <UserChat prop={User.id} />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;