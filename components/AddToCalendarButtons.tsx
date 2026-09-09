"use client";

import type { CalendarAudience } from "@/lib/calendar";
import AppleIcon from "@mui/icons-material/Apple";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GoogleIcon from "@mui/icons-material/Google";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

type Links = {
  google: string;
  outlook: string;
  ics: string;
};

export default function AddToCalendarButtons({
  links,
  audience,
}: {
  links: Links;
  audience: CalendarAudience;
}) {
  const icsLabel = audience === "studio" ? "Apple / Outlook (studio)" : "Apple / Outlook";

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ flexWrap: "wrap" }}>
      <Button href={links.google} target="_blank" rel="noopener noreferrer" variant="contained" startIcon={<GoogleIcon />}>
        Google Calendar
      </Button>
      <Button href={links.outlook} target="_blank" rel="noopener noreferrer" variant="outlined" color="inherit" startIcon={<EventAvailableIcon />}>
        Outlook
      </Button>
      <Button href={links.ics} variant="outlined" color="inherit" startIcon={<AppleIcon />}>
        {icsLabel}
      </Button>
    </Stack>
  );
}
