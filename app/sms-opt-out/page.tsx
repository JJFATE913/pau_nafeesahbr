import SmsOptOutForm from "@/components/SmsOptOutForm";
import { business } from "@/lib/business";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMS opt-out",
  description: `Stop appointment text messages from ${business.name}.`,
};

export default function SmsOptOutPage() {
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
          Texts
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: 34, md: 56 }, mt: 1, mb: 2 }}>
          Opt out of appointment texts
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 5, fontSize: 18, maxWidth: 640 }}>
          {business.name} only texts about bookings you request. Enter the mobile number that
          receives those messages to stop them. Existing appointments stay on the calendar — call{" "}
          {business.phoneDisplay} if you need to change a visit. See the{" "}
          <Link href="/legal/sms-terms" color="info.main" underline="hover">
            SMS Terms
          </Link>{" "}
          for details.
        </Typography>
        <SmsOptOutForm />
      </Container>
    </Box>
  );
}
