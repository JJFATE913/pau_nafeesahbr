"use client";

import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export type GalleryPhoto = {
  id: string;
  url: string;
  caption: string;
};

export default function GalleryGrid({ items }: { items: GalleryPhoto[] }) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down("sm"));
  const medium = useMediaQuery(theme.breakpoints.down("md"));

  if (!items.length) {
    return (
      <Box
        sx={{
          py: 8,
          px: 3,
          textAlign: "center",
          border: "1px dashed rgba(244, 167, 197, 0.28)",
          borderRadius: 3,
        }}
      >
        <Typography variant="h5">The gallery is being styled</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          New looks are published from the staff gallery page and appear here immediately.
        </Typography>
      </Box>
    );
  }

  return (
    <ImageList variant="masonry" cols={compact ? 1 : medium ? 2 : 3} gap={16} sx={{ overflow: "visible" }}>
      {items.map((item) => (
        <ImageListItem key={item.id} sx={{ borderRadius: 2, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.url} alt={item.caption || "Past customer look"} />
          {item.caption ? (
            <ImageListItemBar
              title={item.caption}
              sx={{ background: "linear-gradient(transparent, rgba(8,8,10,0.82))" }}
            />
          ) : null}
        </ImageListItem>
      ))}
    </ImageList>
  );
}
