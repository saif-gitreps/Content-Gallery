/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   darkMode: "class",
   theme: {
      extend: {
         colors: {
            background: {
               light1: "",
               light2: "",
               dark1: "",
               dark2: "",
            },
            text: {},
         },
      },
   },
   plugins: [],
};
