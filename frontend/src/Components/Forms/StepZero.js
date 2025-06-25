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
    nextStep(); // goes to StepOne
  };

  const handleRegister = () => {
    window.dataLayer.push({ event: "button_click", button: "Need to Register", step: "StepZero" });
    goToStep(3); // you can change this to whatever step handles registration
  };

  return (
    <div className="d-flex justify-content-center bg-light px-3 pt-5">
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
              I have registered to vote before
            </Button>

            <Button
              onClick={handleRegister}
              variant="outline-secondary"
              className="py-2"
            >
              I need to register to vote
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default StepZero;
