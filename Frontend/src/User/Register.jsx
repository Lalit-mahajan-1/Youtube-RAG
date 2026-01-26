import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/user`,
        formData
      );
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#020617",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: "#020617",
            border: "1px solid #1f2937",
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "#e5e7eb", fontWeight: 600, mb: 0.5 }}
          >
            Create account
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#9ca3af", mb: 3 }}
          >
            Sign up to start using video chat.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                size="small"
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
                  "& .MuiInputLabel-root": {
                    color: "#9ca3af",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#e5e7eb",
                  },
                }}
              />

              <TextField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                size="small"
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
                  "& .MuiInputLabel-root": {
                    color: "#9ca3af",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#e5e7eb",
                  },
                }}
              />

              <TextField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                size="small"
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
                  "& .MuiInputLabel-root": {
                    color: "#9ca3af",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#e5e7eb",
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                sx={{
                  mt: 1,
                  py: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: 14,
                  bgcolor: "#2563eb",
                  color: "#e5e7eb",
                  "&:hover": {
                    bgcolor: "#1d4ed8",
                  },
                }}
              >
                Submit
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;