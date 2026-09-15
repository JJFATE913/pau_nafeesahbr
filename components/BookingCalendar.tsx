"use client";

import { readJson, type ApiError } from "@/lib/api-client";
import {
  BOOKING_SERVICES,
  CLOSED_WEEKDAYS,
  business,
  durationForService,
  formatDuration,
  formatSlotRange,
} from "@/lib/business";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

type Slot = { time: string; available: boolean };

export default function BookingCalendar() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [serviceKind, setServiceKind] = useState("");
  const [serviceDetail, setServiceDetail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calendarReady, setCalendarReady] = useState(false);
  const slotsRequest = useRef(0);

  const dateIso = selectedDate?.format("YYYY-MM-DD") ?? "";
  const durationMinutes = serviceKind ? durationForService(serviceKind) : 0;

  useEffect(() => {
    const id = window.setTimeout(() => setCalendarReady(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  async function loadSlots(value: Dayjs, service: string) {
    const nextDate = value.format("YYYY-MM-DD");
    setSelectedDate(value);
    setSelectedTime(null);
    setError(null);
    if (!service) {
      setSlots([]);
      return;
    }
    const requestId = ++slotsRequest.current;
    setSlots([]);
    setLoadingSlots(true);
    try {
      const response = await fetch(
        `/api/appointments/availability?date=${nextDate}&service=${encodeURIComponent(service)}`,
      );
      const data = await readJson<ApiError & { slots?: Slot[] }>(response);
      if (requestId !== slotsRequest.current) return;
      if (!response.ok) throw new Error(data.error || "Unable to load times");
      setSlots(data.slots ?? []);
    } catch (err: unknown) {
      if (requestId !== slotsRequest.current) return;
      setError(err instanceof Error ? err.message : "Unable to load times");
      setSlots([]);
    } finally {
      if (requestId === slotsRequest.current) setLoadingSlots(false);
    }
  }

  const shouldDisableDate = (value: Dayjs) => {
    return (
      (CLOSED_WEEKDAYS as readonly number[]).includes(value.day()) ||
      value.isBefore(dayjs(), "day")
    );
  };

  const availableCount = useMemo(
    () => slots.filter((slot) => slot.available).length,
    [slots],
  );

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!dateIso || !selectedTime) return;
    if (!serviceKind || (serviceKind === "other" && serviceDetail.trim().length < 2)) {
      setError(
        serviceKind === "other"
          ? "Please describe the service you want."
          : "Please choose a service.",
      );
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          date: dateIso,
          time: selectedTime,
          serviceKind,
          serviceDetail: serviceKind === "other" ? serviceDetail.trim() : "",
        }),
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
            p: { xs: 2.5, md: 4 },
            borderRadius: 3,
            border: "1px solid rgba(244, 167, 197, 0.22)",
            backgroundColor: "background.paper",
          }}
        >
          <FormControl required>
            <FormLabel id="service-label" sx={{ mb: 1, color: "text.primary" }}>
              Service
            </FormLabel>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Choose what you want done first. Open times change with the length of the visit.
            </Typography>
            <RadioGroup
              aria-labelledby="service-label"
              name="service"
              value={serviceKind}
              onChange={(event) => {
                const next = event.target.value;
                setServiceKind(next);
                if (selectedDate) void loadSlots(selectedDate, next);
              }}
            >
              {BOOKING_SERVICES.map((service) => (
                <FormControlLabel
                  key={service.id}
                  value={service.id}
                  control={<Radio />}
                  label={`${service.label} · ${formatDuration(service.durationMinutes)}`}
                />
              ))}
            </RadioGroup>
          </FormControl>
          {serviceKind === "other" ? (
            <TextField
              label="Describe the service"
              value={serviceDetail}
              onChange={(event) => setServiceDetail(event.target.value)}
              required
              multiline
              minRows={2}
              sx={{ mt: 2, maxWidth: 480 }}
              slotProps={{ htmlInput: { maxLength: 80 } }}
              helperText="Tell us what you would like done. Other visits are booked for 1 hour."
            />
          ) : null}
        </Box>

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
            {calendarReady ? (
              <DateCalendar
                value={selectedDate}
                onChange={(value) => {
                  if (value) void loadSlots(value, serviceKind);
                }}
                shouldDisableDate={shouldDisableDate}
                disablePast
              />
            ) : (
              <Box sx={{ width: { xs: "100%", md: 360 }, height: 320 }} />
            )}
          </Box>
          <Box sx={{ minWidth: 0, width: "100%" }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              {selectedDate ? selectedDate.format("dddd, MMMM D") : "Choose a date"}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {!serviceKind
                ? "Select a service to see visit lengths and open start times."
                : selectedDate
                  ? availableCount
                    ? `${availableCount} start${availableCount === 1 ? "" : "s"} open · ${formatDuration(durationMinutes)} each`
                    : `No remaining ${formatDuration(durationMinutes)} openings on this day`
                  : "Select a studio day to see start times that fit this service."}
            </Typography>
            {loadingSlots ? (
              <CircularProgress size={28} />
            ) : selectedDate && serviceKind ? (
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1.2 }}>
                {slots.map((slot) => (
                  <Button
                    key={slot.time}
                    disabled={!slot.available}
                    variant={selectedTime === slot.time ? "contained" : "outlined"}
                    color={selectedTime === slot.time ? "primary" : "inherit"}
                    onClick={() => setSelectedTime(slot.time)}
                    sx={{ minWidth: durationMinutes >= 120 ? 168 : 128 }}
                  >
                    {formatSlotRange(slot.time, durationMinutes)}
                  </Button>
                ))}
              </Stack>
            ) : null}
          </Box>
        </Box>

        {selectedTime && serviceKind ? (
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
              Holding {formatSlotRange(selectedTime, durationMinutes)} on{" "}
              {selectedDate?.format("MMMM D, YYYY")}.
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
                placeholder={business.phoneDisplay}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={
                  submitting ||
                  (serviceKind === "other" && serviceDetail.trim().length < 2)
                }
                sx={{ alignSelf: "flex-start" }}
              >
                {submitting ? "Reserving…" : "Confirm appointment"}
              </Button>
            </Stack>
          </Box>
        ) : null}
      </Stack>
    </LocalizationProvider>
  );
}
