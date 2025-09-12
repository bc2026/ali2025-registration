import React, { useEffect, useState } from "react";
import { Form, Card, Button, ProgressBar } from "react-bootstrap";
import validator from "validator";

const StepTwo = ({ nextStep, handleFormData, prevStep, values }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    const start = Date.now();
    window.dataLayer.push({ event: 'form_step_view', step: 'StepTwo' });

    return () => {
      const duration = Date.now() - start;
      window.dataLayer.push({ event: 'time_on_step', step: 'StepTwo', duration_ms: duration });
    };
  }, []);

  const submitFormData = async (e) => {
    e.preventDefault();

    if (
      validator.isEmpty(values.address) ||
      validator.isEmpty(values.residence_zip) ||
      validator.isEmpty(values.dob)
    ) {
      setError(true);
    } else {
      window.dataLayer.push({ event: 'button_click', button: 'Submit', step: 'StepTwo' });

      const res = await fetch('https://canivotejc.com/find-voter/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      values.is_reg = res.ok ? true : res.status === 404 ? false : undefined;

      nextStep();
    }
  };

  return (
    <>
      <Card style={{ marginTop: 100 }}>
        <Card.Body>
          <Form onSubmit={submitFormData}>
            {/* Required fields */}
            {["address", "residence_zip", "dob"].map((field, idx) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label>
                  {field === "dob"
                    ? "Date of Birth"
                    : field.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
                </Form.Label>
                <Form.Control
                  style={{ border: error ? "2px solid red" : "" }}
                  type={field === "dob" ? "text" : "text"}
                  placeholder={field === "dob" ? "MM/DD/YYYY" : field.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
                  inputMode={field === "dob" ? "numeric" : undefined}
                  pattern={field === "dob" ? "^(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/(19|20)\\d\\d$" : undefined}
                  onFocus={() => window.dataLayer.push({ event: 'field_focus', field })}
                  onBlur={(e) =>
                    window.dataLayer.push({ event: 'field_blur', field, value: e.target.value })
                  }
                  onChange={handleFormData(field)}
                  defaultValue={values[field]}
                />
                {error && (
                  <Form.Text style={{ color: "red" }}>
                    This is a required field
                  </Form.Text>
                )}
                {field === "dob" && (
                  <Form.Text className="text-muted">
                    Format: MM/DD/YYYY
                  </Form.Text>
                )}
              </Form.Group>
            ))}
            {/* Optional fields at the bottom */}
            {["email", "phone_no"].map((field) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label>
                  {field === "email"
                    ? "Email (optional)"
                    : field === "phone_no"
                    ? "Phone Number (optional)"
                    : field.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
                </Form.Label>
                <Form.Control
                  type={field === "email" ? "email" : "text"}
                  placeholder={field === "email" ? "Email (optional)" : "Phone Number (optional)"}
                  onFocus={() => window.dataLayer.push({ event: 'field_focus', field })}
                  onBlur={(e) =>
                    window.dataLayer.push({ event: 'field_blur', field, value: e.target.value })
                  }
                  onChange={handleFormData(field)}
                  defaultValue={values[field]}
                />
              </Form.Group>
            ))}
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Button
                variant="primary"
                onClick={() => {
                  window.dataLayer.push({
                    event: 'button_click',
                    button: 'Previous',
                    step: 'StepTwo'
                  });
                  prevStep();
                }}
              >
                Previous
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Gold Progress Bar BELOW the card */}
      <div style={{ width: "100%", maxWidth: 500, marginTop: "1rem" }}>
        <ProgressBar now={33} style={{ backgroundColor: "#e0e0e0" }}>
          <ProgressBar
            now={100}
            style={{ backgroundColor: "gold" }}
            label=""
            animated
          />
        </ProgressBar>
      </div>
    </>
  );
};

export default StepTwo;
