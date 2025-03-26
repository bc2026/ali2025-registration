import React from "react";
import { Card } from "react-bootstrap";

const Final = ({ values }) => {

    //destructuring the object from values
  const { firstName, lastName, email, phone_no, address, zip, dob, is_reg} = values;
  return (
    <>
      <Card style={{ marginTop: 100, textAlign: "left" }}>
        <Card.Body>
          <p>
            <strong>First Name :</strong> {firstName}{" "}
          </p>
          <p>
            <strong>Last Name :</strong> {lastName}{" "}
          </p>
          <p>
            <strong>Email :</strong> {email}{" "}
          </p>
          <p>
            <strong>Email :</strong> {phone_no}{" "}
          </p>

          <p>
            <strong>Email :</strong> {address}{" "}
          </p>

          <p>
            <strong>Email :</strong> {zip}{" "}
          </p>

          <p>
            <strong> Registered: </strong> {is_reg}{" "}
          </p>


        </Card.Body>
      </Card>
    </>
  );
};

export default Final;
