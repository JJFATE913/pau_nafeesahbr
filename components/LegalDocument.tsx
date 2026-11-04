import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { LEGAL_EFFECTIVE_DATE, type LegalDoc } from "@/lib/legal";

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
          {doc.kicker}
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: 34, md: 56 }, mt: 1, mb: 2 }}>
          {doc.title}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 6, fontSize: 16 }}>
          Effective {LEGAL_EFFECTIVE_DATE}.
        </Typography>
        {doc.sections.map((section) => (
          <Box key={section.heading} sx={{ mb: 4.5 }}>
            <Typography variant="h4" sx={{ mb: 1.5, fontSize: { xs: 22, md: 26 } }}>
              {section.heading}
            </Typography>
            {section.blocks.map((block, index) =>
              block.type === "ul" ? (
                <Box
                  key={`${section.heading}-ul-${index}`}
                  component="ul"
                  sx={{
                    m: 0,
                    pl: 3,
                    color: "text.secondary",
                    fontSize: 17,
                    lineHeight: 1.7,
                    "& li": { mb: 1 },
                  }}
                >
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </Box>
              ) : (
                <Typography
                  key={`${section.heading}-p-${index}`}
                  color="text.secondary"
                  sx={{ fontSize: 17, lineHeight: 1.7, mb: 1.5 }}
                >
                  {block.text}
                </Typography>
              ),
            )}
          </Box>
        ))}
      </Container>
    </Box>
  );
}
