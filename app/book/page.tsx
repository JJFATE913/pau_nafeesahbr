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
          Select a studio day on the calendar. Open hour-long times appear immediately. Then leave
          your name and phone number to hold the chair. We text you and the studio, and you can add
          the visit to your calendar.
        </Typography>
        <BookingCalendar />
      </Container>
    </Box>
  );
}
