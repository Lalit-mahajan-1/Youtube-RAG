// Page/UserChat.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  CircularProgress,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const UserChat = ({ prop }) => {
  const [links, setLinks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllChat = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_ML_API}/get-url/${prop}`,
          { withCredentials: true }
        );
        setLinks(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (prop) getAllChat();
  }, [prop]);

  const handleOpenChat = (item) => {
    const url = `${import.meta.env.VITE_FRONTEND_API}/chat/${item.user_id}/${item.video_id}`;
    // open in SAME tab
    window.location.href = url;
  };

  if (loading) {
    return (
      <Box
        sx={{
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          color: "#9ca3af",
        }}
      >
        <CircularProgress size={22} sx={{ color: "#3b82f6" }} />
        <Typography variant="body2">Loading your chats...</Typography>
      </Box>
    );
  }

  if (!links || links.length === 0) {
    return (
      <Box sx={{ py: 4, px: 2, color: "#6b7280" }}>
        <Typography variant="body2">
          No chats yet. Upload a video to start one.
        </Typography>
      </Box>
    );
  }

  return (
    <List
      disablePadding
      sx={{
        "&::-webkit-scrollbar": { width: 6 },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#1f2937",
          borderRadius: 999,
        },
      }}
    >
      {links.map((item) => {
        const chatUrl = `${import.meta.env.VITE_FRONTEND_API}/chat/${item.user_id}/${item.video_id}`;

        return (
          <ListItemButton
            key={item.id}
            onClick={() => handleOpenChat(item)}
            sx={{
              px: 2,
              py: 1.2,
              borderRadius: 1,
              mb: 0.5,
              color: "#e5e7eb",
              "&:hover": {
                bgcolor: "#0b1120",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 32,
                color: "#3b82f6",
              }}
            >
              <ChatBubbleOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: "#e5e7eb" }}
                >
                  Video #{item.video_id}
                </Typography>
              }
              secondary={
                <Typography
                  variant="caption"
                  sx={{
                    color: "#9ca3af",
                    display: "block",
                    mt: 0.2,
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={chatUrl}
                >
                  {chatUrl}
                </Typography>
              }
            />
          </ListItemButton>
        );
      })}
    </List>
  );
};

export default UserChat;