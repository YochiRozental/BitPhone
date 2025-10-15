import { createTheme } from "@mui/material/styles";
import { heIL } from "@mui/material/locale";

const theme = createTheme(
    {
        direction: "rtl",
        typography: {
            fontFamily: `'Assistant', 'Arial', sans-serif`,
        },
        palette: {
            primary: {
                main: "#1976d2",
            },
            secondary: {
                main: "#9c27b0",
            },
            background: {
                default: "#f9f9f9",
            },
        },
    },
    heIL
);

export default theme;
