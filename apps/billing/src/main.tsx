import React from "react";
import { createRoot } from "react-dom/client";
import { AppFrame, Card } from "@toy/ui";
import "./index.css";

function App() {
  return (
    <AppFrame
      eyebrow="Billing team"
      title="Billing App"
      description="This is the billing team's independently built Vite app. It shares the same shell-style menu and design system."
    >
      <Card title="Billing App">
        <p>This app can be deployed independently to the <code>/billing/</code> path.</p>
        <p className="mt-3">A billing team release does not need to rebuild or redeploy the admin or dashboard apps.</p>
      </Card>
    </AppFrame>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
