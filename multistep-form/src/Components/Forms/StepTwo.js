
import React, { useEffect, useState } from "react";
import { Form, Card, Button } from "react-bootstrap";
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

    if (validator.isEmpty(values.email) || validator.isEmpty(values.phone_no) ||
        validator.isEmpty(values.address) || validator.isEmpty(values.residence_zip) ||
        validator.isEmpty(values.dob)) {
      setError(true);
    } else {
      window.dataLayer.push({ event: 'button_click', button: 'Submit', step: 'StepTwo' });

      const res = await fetch('/find-voter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      values.is_reg = res.ok ? true : res.status === 404 ? false : undefined;

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
                onFocus={() => window.dataLayer.push({ event: 'field_focus', field })}
                onBlur={(e) => window.dataLayer.push({ event: 'field_blur', field, value: e.target.value })}
                onChange={handleFormData(field)}
              />
              {error && <Form.Text style={{ color: "red" }}>This is a required field</Form.Text>}
            </Form.Group>
          ))}
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button variant="primary" onClick={() => { window.dataLayer.push({ event: 'button_click', button: 'Previous', step: 'StepTwo' }); prevStep(); }}>
              Previous
            </Button>
            <Button variant="primary" type="submit">Submit</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default StepTwo;
