import { useState } from "react";
import "./App.css";

function App() {
   return <h1>{import.meta.env.VITE_APPWRITE_URL}</h1>;
}

export default App;
