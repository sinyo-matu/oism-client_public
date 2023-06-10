module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layout/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        default: "#fffbf2",
        main: "#caad5f",
        success: "#2c974b",
        error: "#DC3545",
        warning: "#eac54f",
        sub: "#A2B7A0",
        black: "#2d2d2d",
        subLight: "#A2B7A066",
        mainLight: "#caad5f66",
        jpRed: "#bc002d",
        cnRed: "#de2910",
        cnYellow: "#ffde00",
      },
      maxWidth: {
        "8xl": "1600px",
      },
      boxShadow: {
        around: "0 0px 0.5em",
        aroundMini: "0 0px 0.5em -0.1rem",
      },
    },
  },
  plugins: [],
};
