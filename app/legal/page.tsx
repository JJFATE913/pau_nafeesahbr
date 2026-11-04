import { LEGAL_EFFECTIVE_DATE, legalDocs } from "@/lib/legal";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const metadata = {
  title: "Legal policies",
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
          Legal
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: 34, md: 56 }, mt: 1, mb: 2 }}>
          Policies
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 5, fontSize: 17, maxWidth: 640 }}>
          Terms, privacy, SMS, booking, and related studio policies. Updated{" "}
          {LEGAL_EFFECTIVE_DATE}.
        </Typography>
        <Stack spacing={2.5}>
          {legalDocs.map((doc) => (
            <Box
              key={doc.slug}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(244, 167, 197, 0.18)",
                backgroundColor: "background.paper",
              }}
            >
              <Link
                href={`/legal/${doc.slug}`}
                underline="hover"
                color="inherit"
                sx={{ typography: "h4", fontSize: { xs: 22, md: 26 } }}
              >
                {doc.title}
              </Link>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {doc.summary}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
