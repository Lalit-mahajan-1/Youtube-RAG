// Page/VideoUpload.jsx
import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Stack } from "@mui/material";

const VideoUpload = ({ prop }) => {
  const [videourl, setVideourl] = useState("");

  const handleChange = (e) => {
    setVideourl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videourl.trim()) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_ML_API}/url/${prop}`,
        {
          URL: videourl,
          Id: prop,
        },
        { withCredentials: true }
      );
      setVideourl("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems="center"
      >
        <TextField
          fullWidth
          size="medium"
          placeholder="Paste a video URL"
          value={videourl}
          onChange={handleChange}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "#020617",
              color: "#e5e7eb",
              "& fieldset": {
                borderColor: "#1f2937",
              },
              "&:hover fieldset": {
                borderColor: "#3b82f6",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#3b82f6",
              },
            },
            "& .MuiInputBase-input": {
              fontSize: 14,
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#6b7280",
            },
          }}
        />
        <Button
          type="submit"
          disabled={!videourl.trim()}
          sx={{
            px: 3,
            py: 1.1,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            fontSize: 14,
            bgcolor: "#2563eb",
            color: "#e5e7eb",
            whiteSpace: "nowrap",
            "&:hover": {
              bgcolor: "#1d4ed8",
            },
            "&.Mui-disabled": {
              bgcolor: "#1f2937",
              color: "#6b7280",
            },
          }}
        >
          Start chat
        </Button>
      </Stack>
    </Box>
  );
};

export default VideoUpload;