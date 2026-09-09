import AddToCalendarButtons from "@/components/AddToCalendarButtons";
import { getAppointmentById } from "@/lib/appointments";
import { business, formatSlotLabel } from "@/lib/business";
import { calendarLinks } from "@/lib/calendar";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BookingConfirmedPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ texts?: string }>;
}) {
  const { id } = await params;
  const { texts } = await searchParams;
  const appointment = await getAppointmentById(id);
  if (!appointment) notFound();

  const guestLinks = calendarLinks(appointment, "guest");
  const studioLinks = calendarLinks(appointment, "studio");
  const when = dayjs(`${appointment.date}T${appointment.time}`).format("dddd, MMMM D, YYYY");

  return (
    <Box className="hero-mesh" sx={{ py: { xs: 8, md: 10 } }}>
      <Container maxWidth="md">
        <Typography
          sx={{ letterSpacing: "0.42em", textTransform: "uppercase", color: "info.main", fontSize: 12 }}
        >
          Confirmed
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: 42, md: 64 }, mt: 1, mb: 2 }}>
          You are on the book
        </Typography>
        {texts === "sent" ? (
          <Alert severity="success" sx={{ mb: 3 }}>
            Confirmation texts were sent to you and to the studio.
          </Alert>
        ) : null}
        {texts === "partial" ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            The appointment is booked, but one of the confirmation texts did not send. Please call
            the studio if you do not receive a message.
          </Alert>
        ) : null}
        {texts === "setup" ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            The appointment is booked. Confirmation texts will send once Twilio and OWNER_PHONE are
            set in the server environment.
          </Alert>
        ) : null}

        <Typography color="text.secondary" sx={{ fontSize: 18, mb: 4 }}>
          {appointment.name}, we have {when} at {formatSlotLabel(appointment.time)} held at{" "}
          {business.name}.{" "}
          {texts === "sent"
            ? "A confirmation text was sent to your phone and to the studio."
            : texts === "partial"
              ? "Please keep this page — one of the confirmation texts may not have arrived."
              : "Keep this page to add the visit to a calendar. Confirmation texts will go out once studio messaging is connected."}{" "}
          The same add-to-calendar buttons are linked from those texts.
        </Typography>

        <Box
          sx={{
            p: { xs: 2.5, md: 4 },
            mb: 3,
            borderRadius: 3,
            backgroundColor: "background.paper",
            border: "1px solid rgba(244, 167, 197, 0.22)",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Guest calendar
          </Typography>
          <AddToCalendarButtons links={guestLinks} audience="guest" />
        </Box>

        <Box
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: 3,
            backgroundColor: "background.paper",
            border: "1px solid rgba(244, 167, 197, 0.22)",
          }}
        >
          <Typography variant="h5" sx={{ mb: 1 }}>
            Studio calendar
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            For Pau-Nafeesah — labeled with the guest name so it is easy to spot in your calendar.
          </Typography>
          <AddToCalendarButtons links={studioLinks} audience="studio" />
        </Box>
      </Container>
    </Box>
  );
}
