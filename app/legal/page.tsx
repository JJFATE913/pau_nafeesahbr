import { business } from "@/lib/business";
import { LEGAL_EFFECTIVE_DATE, legalNav } from "@/lib/legal";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal",
  description: `Privacy, terms, booking, SMS, and related studio policies for ${business.name}.`,
};

export default function LegalIndexPage() {
  return (
    <Box className="hero-mesh" sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="md">
        <Typography
          sx={{
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "info.main",
            fontSize: 12,
          }}
        >
          Policies
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: 34, md: 56 }, mt: 1, mb: 2 }}>
          Legal
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 6, fontSize: 18, maxWidth: 640 }}>
          Privacy, booking, texts, photos, and related studio policies. Last updated{" "}
          {LEGAL_EFFECTIVE_DATE}.
        </Typography>
        <Stack spacing={2}>
          {legalNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              underline="hover"
              color="inherit"
              sx={{
                display: "block",
                p: 2.5,
                borderRadius: 2,
                border: "1px solid rgba(244, 167, 197, 0.16)",
                backgroundColor: "background.paper",
                fontSize: 18,
              }}
            >
              {item.label}
            </Link>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
