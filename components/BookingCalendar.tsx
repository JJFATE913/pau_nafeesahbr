"use client";

import { readJson, type ApiError } from "@/lib/api-client";
import { formatSlotLabel } from "@/lib/business";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Slot = { time: string; available: boolean };

export default function BookingCalendar() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateIso = selectedDate?.format("YYYY-MM-DD") ?? "";

  async function loadSlots(value: Dayjs) {
    const nextDate = value.format("YYYY-MM-DD");
    setSelectedDate(value);
    setSelectedTime(null);
    setError(null);
    setLoadingSlots(true);
    try {
      const response = await fetch(`/api/appointments/availability?date=${nextDate}`);
      const data = await readJson<ApiError & { slots?: Slot[] }>(response);
      if (!response.ok) throw new Error(data.error || "Unable to load times");
      setSlots(data.slots ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load times");
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }

  const shouldDisableDate = (value: Dayjs) => {
    const weekday = value.day();
    return weekday === 0 || weekday === 1 || value.isBefore(dayjs(), "day");
  };

  const availableCount = useMemo(
    () => slots.filter((slot) => slot.available).length,
    [slots],
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!dateIso || !selectedTime) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, date: dateIso, time: selectedTime }),
      });
      const data = await readJson<
        ApiError & {
          appointment?: { id: string };
          sms?: { skipped?: boolean; client?: boolean; studio?: boolean };
        }
      >(response);
      if (!response.ok || !data.appointment) {
        throw new Error(data.error || "Booking failed");
      }
      const texts =
        data.sms?.skipped ? "setup" : data.sms?.client && data.sms?.studio ? "sent" : "partial";
      router.push(`/book/confirmed/${data.appointment.id}?texts=${texts}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4}>
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
              "& .MuiPickersSlideTransition-root": {
                minHeight: 240,
              },
              "& .MuiPickersDay-root.Mui-selected": {
                background: "linear-gradient(120deg, #E2187A, #8E2AA3)",
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
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {selectedDate
                ? availableCount
                  ? `${availableCount} time${availableCount === 1 ? "" : "s"} open`
                  : "No remaining times on this day"
                : "Select a highlighted studio day to reveal open hour-long appointments."}
            </Typography>
            {loadingSlots ? (
              <CircularProgress size={28} />
            ) : selectedDate ? (
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1.2 }}>
                {slots.map((slot) => (
                  <Button
                    key={slot.time}
                    disabled={!slot.available}
                    variant={selectedTime === slot.time ? "contained" : "outlined"}
                    color={selectedTime === slot.time ? "primary" : "inherit"}
                    onClick={() => setSelectedTime(slot.time)}
                    sx={{ minWidth: 112 }}
                  >
                    {formatSlotLabel(slot.time)}
                  </Button>
                ))}
              </Stack>
            ) : null}
          </Box>
        </Box>

        {selectedTime ? (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: { xs: 2.5, md: 4 },
              borderRadius: 3,
              border: "1px solid rgba(244, 167, 197, 0.22)",
              backgroundColor: "background.paper",
            }}
          >
            <Typography variant="h5" sx={{ mb: 1 }}>
              Guest details
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Holding {formatSlotLabel(selectedTime)} on {selectedDate?.format("MMMM D, YYYY")}.
            </Typography>
            <Stack spacing={2.5} sx={{ maxWidth: 480 }}>
              <TextField
                label="Full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                autoComplete="name"
              />
              <TextField
                label="Phone number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
                autoComplete="tel"
                placeholder="(555) 214-8800"
              />
              <Button type="submit" variant="contained" disabled={submitting} sx={{ alignSelf: "flex-start" }}>
                {submitting ? "Reserving…" : "Confirm appointment"}
              </Button>
            </Stack>
          </Box>
        ) : null}
      </Stack>
    </LocalizationProvider>
  );
}
