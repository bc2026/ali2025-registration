import React, { useState } from "react";
import { Form, Card, Button } from "react-bootstrap";
import validator from "validator";
import { trackEvent } from "../../trackEvent";

const StepTwo = ({ nextStep, handleFormData, prevStep, values }) => {
  const [error, setError] = useState(false);

  const submitFormData = async (e) => {
    e.preventDefault();

    if (
      validator.isEmpty(values.email) ||
      validator.isEmpty(values.phone_no) ||
      validator.isEmpty(values.address) || 
      validator.isEmpty(values.residence_zip) ||
      validator.isEmpty(values.dob)
    ) {
      setError(true);
    } else {
      const { first_name, last_name, email, phone_no, address, residence_zip, dob } = values;

      const res = await fetch('/find-voter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name, last_name, email, phone_no, address, residence_zip, dob })
      });

      if (res.ok) {
        values.is_reg = true;
      } else if (res.status === 404) {
        values.is_reg = false;
      }

      nextStep();
    }
  };

  return (
    <Card style={{ marginTop: 100 }}>
      <Card.Body>
        <Form onSubmit={submitFormData}>
          {["email", "phone_no", "address", "residence_zip", "dob"].map((field, idx) => (
            <Form.Group className="mb-3" key={idx}>
              <Form.Label>{field.replace("_", " ").toUpperCase()}</Form.Label>
              <Form.Control
                style={{ border: error ? "2px solid red" : "" }}
                type={field === "dob" ? "date" : "text"}
                placeholder={field.replace("_", " ")}
                onChange={(e) => {
                  trackEvent("field_input", { field });
                  handleFormData(field)(e);
                }}
              />
              {error && <Form.Text style={{ color: "red" }}>This is a required field</Form.Text>}
            </Form.Group>
          ))}
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button
              variant="primary"
              onClick={() => {
                trackEvent("button_click", { button: "Back" });
                prevStep();
              }}
            >
              Previous
            </Button>
            <Button
              variant="primary"
              type="submit"
              onClick={() => trackEvent("button_click", { button: "Submit" })}
            >
              Submit
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default StepTwo;
