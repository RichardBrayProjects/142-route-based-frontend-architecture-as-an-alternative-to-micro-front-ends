import React from "react";
import { createRoot } from "react-dom/client";
import { AppFrame, Button, Card } from "@toy/ui";
import "./index.css";

function App() {
  return (
    <AppFrame
      eyebrow="Platform shell"
      title="Toy Multi-App UI"
      description="The shell owns the product frame, shared navigation and the entry point into team-owned apps. In local development, the shell dev server proxies app paths to the other Vite dev servers."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Admin Team">
          <p className="mb-4">A separately built and deployed Vite app.</p>
          <a href="/admin/"><Button>Open admin</Button></a>
        </Card>
        <Card title="Billing Team">
          <p className="mb-4">A separately built and deployed Vite app.</p>
          <a href="/billing/"><Button>Open billing</Button></a>
        </Card>
        <Card title="Dashboard Team">
          <p className="mb-4">A separately built and deployed Vite app.</p>
          <a href="/dashboard/"><Button>Open dashboard</Button></a>
        </Card>
      </div>
    </AppFrame>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
