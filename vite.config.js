import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: this must exactly match your GitHub repo name, wrapped in slashes.
// If your repo is named "studysync", leave as-is. If you named it something else,
// change "studysync" below to match (e.g. base: "/my-repo-name/").
export default defineConfig({
  plugins: [react()],
  base: "/studysync/",
});
