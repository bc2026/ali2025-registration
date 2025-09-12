import React, { useEffect } from "react";
import { Card, Button, ProgressBar } from "react-bootstrap";

const StepZero = ({ nextStep, goToStep }) => {
  useEffect(() => {
    const start = Date.now();
    window.dataLayer.push({ event: "form_step_view", step: "StepZero" });

    return () => {
      const duration = Date.now() - start;
      window.dataLayer.push({ event: "time_on_step", step: "StepZero", duration_ms: duration });
    };
  }, []);

  const handleContinue = () => {
    window.dataLayer.push({ event: "button_click", button: "Registered", step: "StepZero" });
    nextStep();
  };

  const handleRegister = () => {
    window.dataLayer.push({ event: "button_click", button: "Need to Register", step: "StepZero" });
    goToStep(3);
  };

  return (
    <div className="d-flex flex-column align-items-center bg-light px-3 pt-5 w-100">
      {/* Gold Progress Bar BELOW the card */}
      <div style={{ width: "100%", maxWidth: 500, marginTop: "1rem" }}>
        <ProgressBar now={33} style={{ backgroundColor: "#e0e0e0" }}>
          <ProgressBar
            now={25}
            style={{ backgroundColor: "gold" }}
            label=""
            animated
          />
        </ProgressBar>
      </div>
    </div>
  );
};

export default StepZero;