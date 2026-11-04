"use client";

import { readJson, type ApiError } from "@/lib/api-client";
import { business } from "@/lib/business";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState, type FormEvent } from "react";

export default function SmsOptOutForm() {
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState<"stop" | "start" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function submit(action: "stop" | "start") {
    setSubmitting(action);
    setError(null);
    setStatus(null);
    try {
      const response = await fetch("/api/sms/opt-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, action }),
      });
      const data = await readJson<ApiError & { optedOut?: boolean; alreadyOptedOut?: boolean }>(
        response,
      );
      if (!response.ok) throw new Error(data.error || "Unable to update text preferences.");
      if (action === "start") {
        setStatus(
          "This number can receive appointment texts again. You can reply STOP on any studio text to opt out later.",
        );
      } else if (data.alreadyOptedOut) {
        setStatus("This number is already opted out of appointment texts.");
      } else {
        setStatus(
          "This number is opted out. We will not send appointment confirmation texts to it. You can still call the studio about a visit.",
        );
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to update text preferences.");
    } finally {
      setSubmitting(null);
    }
  }

  function handleOptOut(event: FormEvent) {
    event.preventDefault();
    void submit("stop");
  }

  return (
    <Stack component="form" onSubmit={handleOptOut} spacing={2.5} sx={{ maxWidth: 480 }}>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {status ? <Alert severity="success">{status}</Alert> : null}
      <TextField
        label="Mobile number"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        required
        autoComplete="tel"
        placeholder={business.phoneDisplay}
      />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <Button type="submit" variant="contained" disabled={Boolean(submitting)}>
          {submitting === "stop" ? "Saving…" : "Opt out of texts"}
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="inherit"
          disabled={Boolean(submitting)}
          onClick={() => void submit("start")}
        >
          {submitting === "start" ? "Saving…" : "Opt back in"}
        </Button>
      </Stack>
      <Typography color="text.secondary" sx={{ fontSize: 14 }}>
        You can also reply STOP to an appointment text, or START to opt back in.
      </Typography>
    </Stack>
  );
}
