
import React, { useEffect, useState } from "react";
import { Form, Card, Button } from "react-bootstrap";
import validator from "validator";

const StepOne = ({ nextStep, handleFormData, values }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    const start = Date.now();
    window.dataLayer.push({ event: 'form_step_view', step: 'StepOne' });

    return () => {
      const duration = Date.now() - start;
      window.dataLayer.push({ event: 'time_on_step', step: 'StepOne', duration_ms: duration });
    };
  }, []);

  const submitFormData = (e) => {
    e.preventDefault();
    if (validator.isEmpty(values.first_name) || validator.isEmpty(values.last_name)) {
      setError(true);
    } else {
      window.dataLayer.push({ event: 'button_click', button: 'Continue', step: 'StepOne' });
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
                onFocus={() => window.dataLayer.push({ event: 'field_focus', field: 'first_name' })}
                onBlur={(e) => window.dataLayer.push({ event: 'field_blur', field: 'first_name', value: e.target.value })}
                onChange={handleFormData("first_name")}
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
                onFocus={() => window.dataLayer.push({ event: 'field_focus', field: 'last_name' })}
                onBlur={(e) => window.dataLayer.push({ event: 'field_blur', field: 'last_name', value: e.target.value })}
                onChange={handleFormData("last_name")}
              />
              {error && <Form.Text style={{ color: "red" }}>This is a required field</Form.Text>}
            </Form.Group>
            <Button variant="primary" type="submit">Continue</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default StepOne;
