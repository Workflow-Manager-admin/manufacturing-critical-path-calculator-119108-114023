"use client";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function TopBar() {
  const { user, logout } = useAuth();

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: "1px solid #eee", bgcolor: "#fff", height: 64, justifyContent: "center" }}
    >
      <Toolbar sx={{ minHeight: 64, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" color="primary.main" fontWeight={700}>
          MCT Calculator
        </Typography>
        <Box>
          {user && (
            <Typography component="span" sx={{ mr: 2, color: "#756c6c" }}>
              {user?.email}
            </Typography>
          )}
          <Button
            color="secondary"
            variant="outlined"
            size="small"
            onClick={logout}
            sx={{ borderRadius: 20 }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
