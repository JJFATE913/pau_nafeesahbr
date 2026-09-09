"use client";

import { createTheme } from "@mui/material/styles";

const magenta = "#E2187A";
const pink = "#F4A7C5";
const purple = "#8E2AA3";
const black = "#08080A";
const paper = "#121216";
const white = "#FBF7FA";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: magenta,
      contrastText: white,
    },
    secondary: {
      main: purple,
      contrastText: white,
    },
    background: {
      default: black,
      paper,
    },
    text: {
      primary: white,
      secondary: "rgba(251, 247, 250, 0.72)",
    },
    divider: "rgba(244, 167, 197, 0.16)",
    info: {
      main: pink,
    },
  },
  typography: {
    fontFamily: "var(--font-outfit), sans-serif",
    h1: {
      fontFamily: "var(--font-cormorant), serif",
      fontWeight: 500,
      letterSpacing: "0.04em",
    },
    h2: {
      fontFamily: "var(--font-cormorant), serif",
      fontWeight: 500,
      letterSpacing: "0.06em",
    },
    h3: {
      fontFamily: "var(--font-cormorant), serif",
      fontWeight: 500,
    },
    h4: {
      fontFamily: "var(--font-cormorant), serif",
      fontWeight: 500,
    },
    h5: {
      fontFamily: "var(--font-cormorant), serif",
      fontWeight: 500,
    },
    h6: {
      fontFamily: "var(--font-cormorant), serif",
      fontWeight: 600,
      letterSpacing: "0.08em",
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.12em",
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: black,
          color: white,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          borderRadius: 999,
          paddingInline: 22,
          paddingBlock: 10,
        },
        contained: {
          backgroundImage: `linear-gradient(120deg, ${magenta} 0%, ${purple} 100%)`,
          boxShadow: "0 10px 30px rgba(226, 24, 122, 0.28)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(8, 8, 10, 0.86)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(244, 167, 197, 0.14)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
  },
});
