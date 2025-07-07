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
      <Card style={{ width: "100%", maxWidth: 500 }}>
        <Card.Body>
          <h2 className="mb-2">Your Vote Matters</h2>
          <p className="text-muted">
            Search the city file to get voting information for your residency and check if you're registered to vote.
          </p>

          <div className="d-grid gap-3 mt-4">
            <Button
              onClick={handleContinue}
              className="py-2"
              style={{ backgroundColor: "#1A1A2E", border: "none" }}
            >
              I want to check if I'm registered to vote in Jersey City
            </Button>

            <Button
              onClick={handleRegister}
              variant="outline-secondary"
              className="py-2"
            >
              I know I'm not registered to vote in Jersey City
            </Button>
          </div>
        </Card.Body>
      </Card>

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