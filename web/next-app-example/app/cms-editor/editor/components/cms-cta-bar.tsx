"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import "./cms-cta-bar.css";

const TALLY_FORM_ID = "RGPj8v";

export function CMSCtaBar() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://tally.so/widgets/embed.js"]'
    );
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  if (dismissed) return null;

  const openTallyPopup = () => {
    if (typeof window !== "undefined" && (window as any).Tally) {
      (window as any).Tally.openPopup(TALLY_FORM_ID, {
        layout: "modal",
        width: 500,
        autoClose: 3000,
      });
    } else {
      window.open(`https://tally.so/r/${TALLY_FORM_ID}`, "_blank");
    }
  };

  return (
    <div className="cms-cta-bar">
      <span className="cms-cta-bar-label">Interested in Yoopta CMS?</span>
      <button className="cms-cta-bar-btn cms-cta-bar-btn--primary" onClick={openTallyPopup}>
        Join Waitlist
      </button>
      <a
        href="https://cal.eu/akhmed-ibragimov-ngggdf/30min"
        target="_blank"
        rel="noopener noreferrer"
        className="cms-cta-bar-btn cms-cta-bar-btn--secondary"
      >
        Let&apos;s Talk
      </a>
      <button
        className="cms-cta-bar-dismiss"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}
