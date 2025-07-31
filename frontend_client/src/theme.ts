import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0d0d0d",
    },
    secondary: {
      main: "#f95801",
    },
    background: {
      default: "#ffffff",
      paper: "#fff",
    },
    text: {
      primary: "#171717",
      secondary: "#756c6c",
    },
    accent: {
      main: "#756c6c",
    } as unknown, // satisfies PaletteOptions
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
  },
});

export default theme;
