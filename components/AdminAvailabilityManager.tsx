"use client";

import { formatSlotLabel } from "@/lib/business";
import { readJson, type ApiError } from "@/lib/api-client";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useState } from "react";

type Slot = {
  time: string;
  available: boolean;
  booked: boolean;
  blocked: boolean;
};

export default function AdminAvailabilityManager() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateIso = selectedDate?.format("YYYY-MM-DD") ?? "";

  async function loadSlots(value: Dayjs) {
    const nextDate = value.format("YYYY-MM-DD");
    setSelectedDate(value);
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/availability?date=${nextDate}`);
      const data = await readJson<ApiError & { slots?: Slot[] }>(response);
      if (!response.ok) throw new Error(data.error || "Unable to load hours");
      setSlots(data.slots ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load hours");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateHours(payload: Record<string, unknown>) {
    if (!dateIso) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateIso, ...payload }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update hours");
      setSlots(data.slots ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to update hours");
    } finally {
      setBusy(false);
    }
  }

  const shouldDisableDate = (value: Dayjs) => {
    const weekday = value.day();
    return weekday === 0 || weekday === 1 || value.isBefore(dayjs(), "day");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <Typography color="text.secondary" sx={{ maxWidth: 640 }}>
          Choose a studio day, then tap an open hour to take it off the book. Tap a blocked hour to
          put it back. Guest bookings stay reserved until you contact them separately.
        </Typography>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "auto 1fr" },
            gap: 4,
            alignItems: "start",
          }}
        >
          <Box
            sx={{
              border: "1px solid rgba(244, 167, 197, 0.2)",
              borderRadius: 3,
              overflow: "hidden",
              background:
                "linear-gradient(180deg, rgba(226,24,122,0.08) 0%, rgba(142,42,163,0.08) 100%)",
              "& .MuiDateCalendar-root": {
                width: "100%",
                maxWidth: { xs: "100%", md: 360 },
              },
            }}
          >
            <DateCalendar
              value={selectedDate}
              onChange={(value) => {
                if (value) void loadSlots(value);
              }}
              shouldDisableDate={shouldDisableDate}
              disablePast
            />
          </Box>
          <Box sx={{ minWidth: 0, width: "100%" }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              {selectedDate ? selectedDate.format("dddd, MMMM D") : "Choose a date"}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {selectedDate
                ? "Green hours are open. Magenta hours are blocked. Grey hours already have a guest."
                : "Select a day to edit hour-long chairs."}
            </Typography>
            {selectedDate ? (
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mb: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  disabled={busy || loading}
                  onClick={() => void updateHours({ blockAll: true })}
                >
                  Block remaining hours
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  disabled={busy || loading}
                  onClick={() => void updateHours({ unblockAll: true })}
                >
                  Unblock all hours
                </Button>
              </Stack>
            ) : null}
            {loading ? (
              <CircularProgress size={28} />
            ) : selectedDate ? (
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1.2 }}>
                {slots.map((slot) => {
                  const label = formatSlotLabel(slot.time);
                  if (slot.booked) {
                    return (
                      <Button key={slot.time} disabled variant="outlined" sx={{ minWidth: 128 }}>
                        {label} · booked
                      </Button>
                    );
                  }
                  return (
                    <Button
                      key={slot.time}
                      disabled={busy}
                      variant={slot.blocked ? "contained" : "outlined"}
                      color={slot.blocked ? "primary" : "inherit"}
                      onClick={() => void updateHours({ time: slot.time, blocked: !slot.blocked })}
                      sx={{ minWidth: 128 }}
                    >
                      {label}
                      {slot.blocked ? " · blocked" : ""}
                    </Button>
                  );
                })}
              </Stack>
            ) : null}
          </Box>
        </Box>
      </Stack>
    </LocalizationProvider>
  );
}
