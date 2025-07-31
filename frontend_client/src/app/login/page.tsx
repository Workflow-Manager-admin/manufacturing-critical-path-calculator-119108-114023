"use client";
import React, { useState } from "react";
import { Box, Paper, TextField, Typography, Button, Tabs, Tab, Alert } from "@mui/material";
import { login, register } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { login: loginCtx } = useAuth();
  const router = useRouter();

  const handleLogin = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError(null);
    try {
      const { access_token } = await login(email, password);
      loginCtx(access_token);
      router.push("/dashboard");
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } }; message?: string };
      setError(error?.response?.data?.message ?? error?.message ?? "Unknown error");
    }
  };

  const handleRegister = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError(null);
    try {
      await register(email, password);
      // Auto-login after registration for seamless experience
      const { access_token } = await login(email, password);
      loginCtx(access_token);
      router.push("/dashboard");
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } }; message?: string };
      setError(error?.response?.data?.message ?? error?.message ?? "Unknown error");
    }
  };

  return (
    <Box display="flex" height="100vh" alignItems="center" justifyContent="center" sx={{ background: "#f6f6f6" }}>
      <Paper elevation={3} sx={{ minWidth: 340, px: 4, py: 5 }}>
        <Typography variant="h5" mb={2} fontWeight={700} color="primary.main">
          {tab === 0 ? "Login" : "Register"}
        </Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth" sx={{ mb: 2 }}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        <form onSubmit={tab === 0 ? handleLogin : handleRegister}>
          <TextField
            type="email"
            label="Email"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <TextField
            type="password"
            label="Password"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, borderRadius: 2 }}
          >
            {tab === 0 ? "Log in" : "Register"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
