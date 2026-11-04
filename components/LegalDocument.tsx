import type { LegalDoc } from "@/lib/legal";
import { LEGAL_EFFECTIVE_DATE, legalNav } from "@/lib/legal";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function LegalDocument({ doc }: { doc: LegalDoc }) {
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
          {doc.title}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 1, fontSize: 17 }}>
          {doc.summary}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 5, fontSize: 14 }}>
          Effective {LEGAL_EFFECTIVE_DATE}
        </Typography>

        <Stack spacing={4}>
          {doc.sections.map((section) => (
            <Box key={section.heading}>
              <Typography variant="h4" sx={{ mb: 1.5, fontSize: { xs: 22, md: 26 } }}>
                {section.heading}
              </Typography>
              {section.paragraphs.map((paragraph) => (
                <Typography
                  key={paragraph.slice(0, 48)}
                  color="text.secondary"
                  sx={{ mb: 1.5, fontSize: 16, lineHeight: 1.7 }}
                >
                  {paragraph}
                </Typography>
              ))}
            </Box>
          ))}
        </Stack>

        <Box sx={{ mt: 6, pt: 3, borderTop: "1px solid rgba(244, 167, 197, 0.14)" }}>
          <Typography variant="overline" sx={{ color: "info.main", letterSpacing: "0.2em" }}>
            Other policies
          </Typography>
          <Stack direction="row" sx={{ flexWrap: "wrap", columnGap: 2.5, rowGap: 1, mt: 1.5 }}>
            <Link href="/legal" color="text.secondary" underline="hover" sx={{ fontSize: 14 }}>
              All policies
            </Link>
            {legalNav
              .filter((item) => item.href !== `/legal/${doc.slug}`)
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  color="text.secondary"
                  underline="hover"
                  sx={{ fontSize: 14 }}
                >
                  {item.label}
                </Link>
              ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
