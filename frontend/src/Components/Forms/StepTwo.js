import React, { useEffect, useState } from "react";
import { Form, Card, Button, ProgressBar } from "react-bootstrap";
import validator from "validator";

const StepTwo = ({ nextStep, handleFormData, mergeFormData, prevStep, values }) => {
  const [error, setError] = useState(false);
  const [apiError, setApiError] = useState(null);

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
      setApiError(null);
      window.dataLayer.push({ event: 'button_click', button: 'Submit', step: 'StepTwo' });

      const apiBase = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
      const url = `${apiBase}/find-voter`;
      let res;
      try {
        res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...values,
            residence_zip: values.residence_zip != null ? String(values.residence_zip) : "",
          }),
        });
      } catch {
        setApiError("Could not reach the server. Check your connection or try again.");
        return;
      }

      let payload = null;
      try {
        payload = await res.json();
      } catch {
        payload = null;
      }

      if (res.ok && payload?.success) {
        mergeFormData({
          is_reg: payload.is_registered === true,
          party: payload.party ?? null,
          district: payload.district ?? null,
        });
        nextStep();
      } else if (res.status === 404 && payload?.success) {
        mergeFormData({
          is_reg: false,
          party: null,
          district: null,
        });
        nextStep();
      } else {
        setApiError(payload?.message || "Something went wrong. Please try again.");
      }
    }
  };

  // Custom handler for DOB to auto-insert slashes
  const handleDOBChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 2 && value.length <= 4) {
      value = value.slice(0,2) + "/" + value.slice(2);
    } else if (value.length > 4) {
      value = value.slice(0,2) + "/" + value.slice(2,4) + "/" + value.slice(4,8);
    }
    // Limit to 10 chars (MM/DD/YYYY)
    if (value.length > 10) value = value.slice(0,10);
    // Call the original handler
    handleFormData("dob")({ target: { value } });
  };

  return (
    <>
      <Card style={{ marginTop: 100 }}>
        <Card.Body>
          <Form onSubmit={submitFormData}>
            {apiError && (
              <div className="alert alert-danger mb-3" role="alert">
                {apiError}
              </div>
            )}
            {/* Required fields */}
            {["address", "residence_zip", "dob"].map((field, idx) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label>
                  {field === "dob"
                    ? "Date of Birth"
                    : field.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
                </Form.Label>
                {field === "dob" ? (
                  <Form.Control
                    style={{ border: error ? "2px solid red" : "" }}
                    type="text"
                    placeholder="MM/DD/YYYY"
                    inputMode="numeric"
                    onFocus={() => window.dataLayer.push({ event: 'field_focus', field })}
                    onBlur={(e) =>
                      window.dataLayer.push({ event: 'field_blur', field, value: e.target.value })
                    }
                    onChange={handleDOBChange}
                    value={values.dob || ""}
                  />
                ) : (
                  <Form.Control
                    style={{ border: error ? "2px solid red" : "" }}
                    type="text"
                    placeholder={field.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
                    onFocus={() => window.dataLayer.push({ event: 'field_focus', field })}
                    onBlur={(e) =>
                      window.dataLayer.push({ event: 'field_blur', field, value: e.target.value })
                    }
                    onChange={handleFormData(field)}
                    defaultValue={values[field]}
                  />
                )}
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
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label> {/* Removed (optional) */}
              <Form.Control
                type="tel"
                name="phone_no"
                value={values.phone_no}
                onChange={handleFormData("phone_no")}
                placeholder="Enter your phone number"
              />
            </Form.Group>
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
