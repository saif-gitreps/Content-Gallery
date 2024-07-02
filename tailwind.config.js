/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   darkMode: "class",
   theme: {
      extend: {
         colors: {
            background: {
               lightWhite: colors.white,
               lightGray: colors.gray[100],
               darkBlack: colors.gray[950],
               darkGray: colors.gray[800],
               darkHover: colors.gray[600],
            },
            text: {
               dark: colors.gray[100],
               darkLink: colors.blue[300],
            },
         },
      },
   },
   plugins: [],
};
