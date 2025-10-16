import { createTheme } from "@mui/material/styles";
import { heIL } from "@mui/material/locale";

const theme = createTheme(
    {
        direction: "rtl",
        typography: {
            fontFamily: `'Assistant', 'Arial', sans-serif`,
        },
        palette: {
            primary: { main: "#0056b3" },
            secondary: { main: "#d32f2f" },
            success: { main: "#388e3c" },
            background: { default: "#f0f2f5", paper: "#ffffff" },
        },

        components: {
            MuiTextField: {
                defaultProps: {

                    slotProps: {
                        htmlInput: {
                            step: 50,
                            dir: "ltr",
                            style: { textAlign: "right" },
                        },
                    },
                },
                styleOverrides: {
                    root: {
                        "& input[type=number]": {
                            direction: "ltr",
                            textAlign: "right",
                        },
                    },
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: { transformOrigin: "top right" },
                    shrink: { transformOrigin: "top right", right: "auto" },
                },
            },
        },
    },
    heIL
);

export default theme;
