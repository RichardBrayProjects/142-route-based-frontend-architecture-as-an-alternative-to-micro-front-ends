import React from "react";
import { createRoot } from "react-dom/client";
import { AppFrame, Card } from "@toy/ui";
import "./index.css";

function App() {
  return (
    <AppFrame
      eyebrow="Admin team"
      title="Admin App"
      description="This is the admin team's independently built Vite app. It keeps the same shared navigation so the product feels continuous."
    >
      <Card title="Admin App">
        <p>This app can be deployed independently to the <code>/admin/</code> path.</p>
        <p className="mt-3">Use the menu bar to move back to the shell or into another team app.</p>
      </Card>
    </AppFrame>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
