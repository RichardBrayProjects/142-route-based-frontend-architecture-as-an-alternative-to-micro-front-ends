import React from "react";
import { createRoot } from "react-dom/client";
import { AppFrame, Card } from "@toy/ui";
import "./index.css";

function App() {
  return (
    <AppFrame
      eyebrow="Dashboard team"
      title="Dashboard App"
      description="This is the dashboard team's independently built Vite app. It uses the same shared navigation and Tailwind tokens."
    >
      <Card title="Dashboard App">
        <p>This app can be deployed independently to the <code>/dashboard/</code> path.</p>
        <p className="mt-3">The shared menu makes the route-owned apps feel like one product.</p>
      </Card>
    </AppFrame>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
