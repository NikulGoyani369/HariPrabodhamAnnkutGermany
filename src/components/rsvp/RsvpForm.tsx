import { useState, type FormEvent } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Button,
  Alert,
  Typography,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { submitRsvp, normaliseName, type RsvpInput } from "../../api/rsvp";
import { COUNTRIES } from "../../data/data";
import { C } from "../../theme/theme";
import RsvpConfirmation from "./RsvpConfirmation";
import { rsvpFormStyles as s } from "./RsvpForm.styles";

type Status = "idle" | "submitting" | "error" | "success";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The registrant is always one adult, so the extra-adult dropdown stops one
// short of the 4-adult / 4-child party limit.
const MAX_EXTRA_ADULTS = 3;
const MAX_CHILDREN = 4;

// Kill MUI menu open/close transitions in tests and keep interaction snappy.
const SELECT_SLOT_PROPS = {
  select: { MenuProps: { transitionDuration: 0 } },
} as const;

// The menu lists the full country name, but the closed field shows just the
// flag and code so the dial-code column can stay narrow.
const DIAL_SLOT_PROPS = {
  select: {
    MenuProps: { transitionDuration: 0 },
    renderValue: (value: unknown) => {
      const country = COUNTRIES.find((c) => c.dialCode === value);
      return country ? `${country.flag} ${country.dialCode}` : String(value);
    },
  },
} as const;

const countOptions = (max: number) =>
  Array.from({ length: max + 1 }, (_, i) => i);

interface Props {
  onClose: () => void;
  /** Fired once the confirmation panel takes over, so the dialog can drop
      its "Reserve your place / Registration" header. */
  onSubmitted?: () => void;
}

export default function RsvpForm({ onClose, onSubmitted }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dialCode, setDialCode] = useState("+49");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState(""); // honeypot

  const [extraAdults, setExtraAdults] = useState(0);
  const [children, setChildren] = useState(0);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState("");

  const partySize = 1 + extraAdults + children;

  const validate = () => {
    const e: Record<string, string> = {};
    const name = fullName.trim();
    if (name.length < 2 || name.length > 80)
      e.fullName = "Please enter your name (2–80 characters).";
    if (!EMAIL_RE.test(email.trim()))
      e.email = "Please enter a valid email address.";
    // Phone is optional — only validate what was actually typed.
    const digits = phone.replace(/\D/g, "");
    if (digits && !/^\d{6,15}$/.test(digits)) {
      e.phone = "Please enter a valid phone number (6–15 digits).";
    }
    if (!consent) e.consent = "Please confirm your consent to submit.";
    return e;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    if (company.trim()) {
      setStatus("success"); // honeypot tripped — fake success, no network
      onSubmitted?.();
      return;
    }

    setStatus("submitting");
    setSubmitError("");
    const payload: RsvpInput = {
      fullName,
      email,
      dialCode,
      phone,
      extraAdults,
      children,
      consent,
    };
    try {
      await submitRsvp(payload);
      setStatus("success");
      onSubmitted?.();
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "";
      setSubmitError(
        /fetch|network|Failed to fetch/i.test(msg)
          ? "Couldn't reach the server. Check your connection and try again."
          : "Something went wrong submitting your registration. Please try again or contact us.",
      );
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <RsvpConfirmation
        name={normaliseName(fullName)}
        partySize={partySize}
        onClose={onClose}
      />
    );
  }

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Box sx={s.grid}>
        <TextField
          sx={s.full}
          label="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={!!errors.fullName}
          helperText={errors.fullName}
          fullWidth
        />
        <TextField
          sx={s.full}
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
        />
        <Box sx={s.phoneRow}>
          <TextField
            select
            label="Dial code"
            value={dialCode}
            onChange={(e) => setDialCode(e.target.value)}
            slotProps={DIAL_SLOT_PROPS}
            fullWidth
          >
            {COUNTRIES.map((c) => (
              <MenuItem key={c.code} value={c.dialCode}>
                {c.flag} {c.label} ({c.dialCode})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
            fullWidth
          />
        </Box>
      </Box>

      <Typography sx={s.memberHeading}>Additional members</Typography>

      <Box sx={s.memberGrid}>
        <TextField
          select
          label="Adults"
          value={extraAdults}
          onChange={(e) => setExtraAdults(Number(e.target.value))}
          slotProps={SELECT_SLOT_PROPS}
          size="small"
          fullWidth
        >
          {countOptions(MAX_EXTRA_ADULTS).map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Children"
          value={children}
          onChange={(e) => setChildren(Number(e.target.value))}
          slotProps={SELECT_SLOT_PROPS}
          size="small"
          fullWidth
        >
          {countOptions(MAX_CHILDREN).map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Typography sx={s.memberCount}>
        You plus {extraAdults + children} other
        {extraAdults + children === 1 ? "" : "s"} - {partySize} attending in
        total.
      </Typography>

      {/* Honeypot — visually hidden, not tab-reachable */}
      <Box sx={s.honeypot} aria-hidden="true">
        <label>
          Company
          <input
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
      </Box>

      <FormControl
        component="fieldset"
        error={!!errors.consent}
        sx={{ mt: 1, display: "block" }}
      >
        <FormControlLabel
          control={
            <Checkbox
              id="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              slotProps={{
                input: {
                  "aria-describedby": errors.consent
                    ? "consent-error"
                    : undefined,
                },
              }}
            />
          }
          label={
            <Typography sx={{ fontSize: 13.5, color: C.inkSoft }}>
              I consent to my details being used to organise this event, per the{" "}
              {/* Closes the dialog too — otherwise the route changes
                  behind a modal that stays mounted on top of it. */}
              <Link component={RouterLink} to="/data-privacy" onClick={onClose}>
                privacy notice
              </Link>
              .
            </Typography>
          }
        />
        {errors.consent && (
          <FormHelperText id="consent-error">{errors.consent}</FormHelperText>
        )}
      </FormControl>

      {status === "error" && (
        <Alert severity="error" role="alert" sx={{ mt: 2 }}>
          {submitError}
        </Alert>
      )}

      <Box sx={s.submitRow}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Submitting…" : "Submit Registration"}
        </Button>
      </Box>
    </Box>
  );
}
