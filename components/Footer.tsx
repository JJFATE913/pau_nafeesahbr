import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { business } from "@/lib/business";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: "1px solid rgba(244, 167, 197, 0.14)",
        background:
          "linear-gradient(180deg, rgba(18,18,22,0) 0%, rgba(18,18,22,0.9) 40%, #0A0A0E 100%)",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ justifyContent: "space-between" }}
        >
          <Box>
            <Typography variant="h5">{business.name}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 360 }}>
              A private beauty studio for hair, lashes, glam, and nails — crafted with care in
              black, magenta, pink, and violet.
            </Typography>
          </Box>
          <Box>
            <Typography variant="overline" sx={{ color: "info.main", letterSpacing: "0.2em" }}>
              Visit
            </Typography>
            {business.addressLines.map((line) => (
              <Typography key={line} color="text.secondary">
                {line}
              </Typography>
            ))}
            <Link href={business.phoneHref} color="primary" underline="hover">
              {business.phoneDisplay}
            </Link>
          </Box>
          <Box>
            <Typography variant="overline" sx={{ color: "info.main", letterSpacing: "0.2em" }}>
              Studio
            </Typography>
            {business.hours
              .filter((item) => item.value !== "Closed")
              .map((item) => (
                <Typography key={item.day} color="text.secondary">
                  {item.day}: {item.value}
                </Typography>
              ))}
            <Link
              href="/admin"
              color="text.secondary"
              underline="hover"
              sx={{ display: "block", mt: 2, fontSize: 12, letterSpacing: "0.08em" }}
            >
              Staff login
            </Link>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
