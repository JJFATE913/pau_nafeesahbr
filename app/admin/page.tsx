"use client";

import AdminAvailabilityManager from "@/components/AdminAvailabilityManager";
import AdminGalleryManager from "@/components/AdminGalleryManager";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => {
      fetch("/api/admin")
        .then((response) => response.json())
        .then((data) => setAuthenticated(Boolean(data.authenticated)))
        .finally(() => setChecking(false));
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const response = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Unable to sign in");
      return;
    }
    setAuthenticated(true);
  }

  async function handleLogout() {
    await fetch("/api/admin", { method: "DELETE" });
    setAuthenticated(false);
    setPassword("");
  }

  return (
    <Box className="hero-mesh" sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="lg">
        <Typography
          sx={{ letterSpacing: "0.42em", textTransform: "uppercase", color: "info.main", fontSize: 12 }}
        >
          Staff
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{ mb: 4, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2 }}
        >
          <Typography variant="h1" sx={{ fontSize: { xs: 36, md: 56 } }}>
            Staff studio
          </Typography>
          {authenticated ? (
            <Button onClick={handleLogout} color="inherit" variant="outlined">
              Sign out
            </Button>
          ) : null}
        </Stack>
        {checking ? null : authenticated ? (
          <>
            <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 680 }}>
              Block hours when you are out of the salon, or publish new looks. Use the same login
              from the studio computer or phone.
            </Typography>
            <Tabs
              value={tab}
              onChange={(_event, value: number) => setTab(value)}
              sx={{ mb: 4, borderBottom: "1px solid rgba(244, 167, 197, 0.16)" }}
            >
              <Tab label="Hours" />
              <Tab label="Gallery" />
            </Tabs>
            {tab === 0 ? <AdminAvailabilityManager /> : <AdminGalleryManager />}
          </>
        ) : (
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
              maxWidth: 420,
              p: 4,
              borderRadius: 3,
              backgroundColor: "background.paper",
              border: "1px solid rgba(244, 167, 197, 0.2)",
            }}
          >
            {error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : null}
            <Typography sx={{ mb: 2 }} color="text.secondary">
              Sign in to block appointment hours and update Past Customer photos. Default local
              password is <strong>beautyroom</strong>.
            </Typography>
            <TextField
              label="Staff password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained">
              Sign in
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}
