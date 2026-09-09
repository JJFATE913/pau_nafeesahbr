"use client";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";

type GalleryItem = {
  id: string;
  url: string;
  caption: string;
  createdAt: string;
};

export default function AdminGalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down("sm"));
  const medium = useMediaQuery(theme.breakpoints.down("md"));

  async function loadGallery() {
    const response = await fetch("/api/gallery", { cache: "no-store" });
    const data = await response.json();
    setItems(data.items ?? []);
  }

  useEffect(() => {
    const id = window.setTimeout(() => {
      loadGallery().catch(() => setError("Unable to load gallery"));
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  async function handleUpload(event: React.FormEvent) {
    event.preventDefault();
    if (!file) {
      setError("Choose a photo first.");
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    const body = new FormData();
    body.append("image", file);
    body.append("caption", caption);
    try {
      const response = await fetch("/api/gallery", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      setCaption("");
      setFile(null);
      setMessage("Photo added to Past Customers.");
      await loadGallery();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Delete failed");
      await loadGallery();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stack spacing={3}>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {message ? <Alert severity="success">{message}</Alert> : null}
      <Box
        component="form"
        onSubmit={handleUpload}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px dashed rgba(244, 167, 197, 0.4)",
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Add a new look
        </Typography>
        <Stack spacing={2} sx={{ maxWidth: 480 }}>
          <Button variant="outlined" component="label">
            {file ? file.name : "Choose photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </Button>
          <TextField
            label="Caption (optional)"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
          />
          <Button type="submit" variant="contained" disabled={busy} sx={{ alignSelf: "flex-start" }}>
            {busy ? "Saving…" : "Publish to Past Customers"}
          </Button>
        </Stack>
      </Box>
      <ImageList cols={compact ? 1 : medium ? 2 : 3} gap={16} sx={{ overflow: "visible" }}>
        {items.map((item) => (
          <ImageListItem key={item.id} sx={{ borderRadius: 2, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={item.caption || "Past customer look"} style={{ height: 220, objectFit: "cover" }} />
            <ImageListItemBar
              title={item.caption || "Untitled look"}
              actionIcon={
                <IconButton
                  aria-label={`Delete ${item.caption || "photo"}`}
                  onClick={() => handleDelete(item.id)}
                  sx={{ color: "white" }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Stack>
  );
}
