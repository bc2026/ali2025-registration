import React, { useState } from "react";
import { Form, Card, Button } from "react-bootstrap";
import validator from "validator";
import { trackEvent } from "../../trackEvent";

const StepOne = ({ nextStep, handleFormData, values }) => {
  const [error, setError] = useState(false);

  const trackFormStart = () => {
    if (!window.__formStarted) {
      trackEvent("form_started");
      window.__formStarted = true;
    }
  };

  const submitFormData = (e) => {
    e.preventDefault();

    if (validator.isEmpty(values.first_name) || validator.isEmpty(values.last_name)) {
      setError(true);
    } else {
      nextStep();
    }
  };

  return (
    <div>
      <Card style={{ marginTop: 100 }}>
        <Card.Body>
          <Form onSubmit={submitFormData}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                style={{ border: error ? "2px solid red" : "" }}
                name="first_name"
                defaultValue={values.first_name}
                type="text"
                placeholder="First Name"
                onFocus={trackFormStart}
                onChange={(e) => {
                  trackEvent("field_input", { field: "first_name" });
                  handleFormData("first_name")(e);
                }}
              />
              {error && <Form.Text style={{ color: "red" }}>This is a required field</Form.Text>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                style={{ border: error ? "2px solid red" : "" }}
                name="last_name"
                defaultValue={values.last_name}
                type="text"
                placeholder="Last Name"
                onChange={(e) => {
                  trackEvent("field_input", { field: "last_name" });
                  handleFormData("last_name")(e);
                }}
              />
              {error && <Form.Text style={{ color: "red" }}>This is a required field</Form.Text>}
            </Form.Group>
            <Button variant="primary" type="submit">
              Continue
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default StepOne;
