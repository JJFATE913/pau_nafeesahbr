import BookingCalendar from "@/components/BookingCalendar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function BookPage() {
  return (
    <Box className="hero-mesh" sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="lg">
        <Typography
          sx={{ letterSpacing: "0.42em", textTransform: "uppercase", color: "info.main", fontSize: 12 }}
        >
          Reserve
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: 34, md: 68 }, mt: 1, mb: 2 }}>
          Book an appointment
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 680, mb: 6, fontSize: 18 }}>
          Select a service, then a studio day (Monday–Saturday). Open start times match the length
          of that visit — 30 minutes for brow epilation, one hour for lash lifts, brow lamination,
          and other services, two hours for powder brows and lash extensions. The studio is open
          9:00 AM–7:00 PM; a visit may run until 8:00 PM, so a 6:00 PM powder-brow or lash-extension
          start is available. Leave your name and phone to hold the chair.
        </Typography>
        <BookingCalendar />
      </Container>
    </Box>
  );
}
