import GalleryGrid from "@/components/GalleryGrid";
import { listGallery, publicGalleryPath } from "@/lib/gallery";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export const dynamic = "force-dynamic";

export default async function PastCustomersPage() {
  const items = (await listGallery()).map((item) => ({
    id: item.id,
    url: publicGalleryPath(item.filename),
    caption: item.caption,
  }));

  return (
    <Box className="hero-mesh" sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="lg">
        <Typography
          sx={{ letterSpacing: "0.42em", textTransform: "uppercase", color: "info.main", fontSize: 12 }}
        >
          Portfolio
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: 34, md: 68 }, mt: 1, mb: 2 }}>
          Past Customers
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 640, mb: 6, fontSize: 18 }}>
          Recent finishes from the chair. This gallery is updated on-site as new looks are
          photographed, so it always reflects the current work of the room.
        </Typography>
        <GalleryGrid items={items} />
      </Container>
    </Box>
  );
}
