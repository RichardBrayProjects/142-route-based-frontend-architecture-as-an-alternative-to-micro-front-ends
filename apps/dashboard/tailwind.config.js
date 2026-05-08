const sharedConfig = require("@toy/tailwind-config");

module.exports = {
  presets: [sharedConfig],
  content: ["./index.html", "./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"]
};
