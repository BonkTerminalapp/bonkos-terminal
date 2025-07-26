import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Buffer } from "buffer";

// Global polyfills for browser compatibility
window.global = window;
window.Buffer = Buffer;

createRoot(document.getElementById("root")!).render(<App />);
