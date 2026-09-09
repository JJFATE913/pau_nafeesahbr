import { business } from "@/lib/business";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-title",
});

const heroButtonSx = {
  whiteSpace: "nowrap",
  width: "max-content",
  flexShrink: 0,
  fontSize: { xs: 12, md: 13 },
  letterSpacing: "0.06em",
  px: { xs: 2.25, md: 2.75 },
  py: 1.15,
  lineHeight: 1.2,
  minHeight: 44,
} as const;

export default function HomePage() {
  return (
    <>
      <Box className="hero-mesh" sx={{ py: { xs: 10, md: 16 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(320px, 560px)" },
              gap: { xs: 3, md: 3 },
              alignItems: "center",
            }}
          >
            <Box sx={{ order: { xs: 1, md: 0 } }}>
              <Typography
                sx={{
                  letterSpacing: "0.42em",
                  textTransform: "uppercase",
                  color: "info.main",
                  fontSize: 12,
                  mb: 2,
                  fontFamily: playfair.style.fontFamily,
                }}
              >
                Private studio
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: 36, sm: 48, md: 72 },
                  lineHeight: 0.95,
                  fontFamily: playfair.style.fontFamily,
                }}
              >
                {business.name}
              </Typography>
              <Typography
                sx={{
                  mt: 3,
                  maxWidth: 560,
                  fontSize: { xs: 18, md: 22 },
                  color: "text.secondary",
                }}
              >
                {business.tagline}. A relaxing, invigorating, appointment-only room for lashes, powder brows, epilation and makeup.
                We strive to make you feel glam and beautiful.
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ mt: 5, alignItems: "flex-start", flexWrap: "wrap" }}
              >
                <Button href="/book" variant="contained" sx={heroButtonSx}>
                  Book an appointment
                </Button>
                <Button href="/past-customers" variant="outlined" color="inherit" sx={heroButtonSx}>
                  View past customers
                </Button>
              </Stack>
            </Box>
            <Box
              sx={{
                order: { xs: 0, md: 0 },
                position: "relative",
                width: "100%",
                maxWidth: { xs: 320, md: 560 },
                mx: { xs: "auto", md: 0 },
                justifySelf: { md: "end" },
                aspectRatio: "5400 / 3600",
              }}
            >
              <Image
                src="/Logo_BR.PNG"
                alt="Pau-Nafeesah Beauty Room logo"
                fill
                sizes="(max-width: 900px) 320px, 560px"
                style={{ objectFit: "contain" }}
                priority
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography variant="overline" sx={{ color: "info.main", letterSpacing: "0.24em" }}>
          The room
        </Typography>
        <Typography variant="h2" sx={{ fontSize: { xs: 36, md: 52 }, mt: 1, mb: 3 }}>
          Elevated beauty, never rushed
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 720, fontSize: 18, mb: 6 }}>
          Pau-Nafeesah Beauty Room is a private suite designed for guests who want a polished result
          and a calm experience. Every visit is booked in advance so the chair is yours — no walk-in
          traffic, no waiting room noise. We are here to help you look and feel your best.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          {business.services.map((service) => (
            <Box
              key={service.title}
            sx={{
              p: 3.5,
              minWidth: 0,
              borderRadius: 3,
                backgroundColor: "background.paper",
                border: "1px solid rgba(244, 167, 197, 0.14)",
              }}
            >
              <Typography variant="h4">{service.title}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                {service.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      <Box sx={{ backgroundColor: "background.paper", py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
              gap: 6,
            }}
          >
            <Box>
              <Typography variant="overline" sx={{ color: "info.main", letterSpacing: "0.24em" }}>
                Visit
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: 34, md: 48 }, mt: 1, mb: 2 }}>
                By appointment, in studio
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 18, mb: 3 }}>
                Choose a date on the booking calendar, pick an open hour, and fill out the form. We hold the chair and confirm by call or text.
              </Typography>
              {business.addressLines.map((line) => (
                <Typography key={line}>{line}</Typography>
              ))}
              <Typography sx={{ mt: 1 }}>
                {business.phoneDisplay} · {business.email}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Hours
              </Typography>
              <Stack spacing={1.2}>
                {business.hours.map((item) => (
                  <Stack key={item.day} direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography color="text.secondary">{item.day}</Typography>
                    <Typography>{item.value}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
