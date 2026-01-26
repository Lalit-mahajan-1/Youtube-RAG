// Home.jsx
import React, { useContext } from "react";
import { AuthContext } from "./User/AuthContext";
import { Box, Container, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import VideoUpload from "./Page/VideoUpload";

const MotionPaper = motion.create(Paper);

const Home = () => {
  const { User } = useContext(AuthContext);

  if (!User) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#020617",
          color: "#e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body1">Loading user...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#020617",
        pt: 10,
        pb: 6,
      }}
    >
      <Container maxWidth="md">
        <MotionPaper
          elevation={0}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            bgcolor: "#020617",
            border: "1px solid #1f2937",
          }}
        >
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 1.5,
              fontSize: 11,
              color: "#6b7280",
            }}
          >
            Welcome back
          </Typography>

          <Typography
            variant="h4"
            sx={{
              mt: 0.5,
              mb: 1,
              fontWeight: 600,
              color: "#e5e7eb",
            }}
          >
            Start a new video chat
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#9ca3af", mb: 3, maxWidth: 480 }}
          >
            Paste a video link and we’ll create an interactive chat
            based on its content. Ask questions, get summaries,
            and explore the video with AI.
          </Typography>

          <VideoUpload prop={User.id} />
        </MotionPaper>
      </Container>
    </Box>
  );
};

export default Home;