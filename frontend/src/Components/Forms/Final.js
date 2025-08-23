import React, { useEffect, useState } from "react";
import { Card, Button, ProgressBar } from "react-bootstrap";
import FadeInTextSmallBold from "../FadeInText/FadeInTextSmallBold";

const Final = ({ values, homePage }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    window.dataLayer.push({ event: 'form_step_view', step: 'Final', is_registered: values.is_reg });
  }, [values.is_reg]);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "What do I need to register online?",
      answer: (
        <ol type="1">
          <li>Your Date of Birth</li>
          <li>Your Drivers license OR Your Social Security </li>
          <li> Yep, that's really it! It only takes 5 minutes to register</li>
        </ol>


        
      )
    },
    {
      question: "How do I register online?",
      answer: (
        <ol>
          <li>Go to the <a href="https://voter.svrs.nj.gov/register" target="_blank" rel="noopener noreferrer">New Jersey Online Voter Registration Website</a>.</li>
          <li>Choose your language.</li>
          <li>Enter your Date of Birth.</li>
          <li>Select your form of identification (Driver's License/ID or SSN).</li>
          <li>Provide your signature (if using SSN, sign on-screen or upload a signature).</li>
          <li>Review and submit your registration.</li>
        </ol>
      )
    },
    {
      question: "Can I register by mail?",
      answer: (
        <div>
          <p>Yes! Download the voter registration form from the <a href="https://www.state.nj.us/state/elections/voter-registration.shtml" target="_blank" rel="noopener noreferrer">New Jersey Division of Elections website</a>, print and complete it, then mail it to:</p>
          <address>
            New Jersey Division of Elections <br />
            P.O. Box 304, Trenton, NJ 08625-0304
          </address>
        </div>
      )
    },
    {
      question: "What are the important deadlines?",
      answer: (
        <ul>
          <li>You must register to vote by October 14, 2025 to be eligible to vote in the upcoming election</li>
          <li>If registering by mail, ensure your form is postmarked by the deadline.</li>
        </ul>
      )
    },
    {
    question: "My ID shows I'm not living in Jersey City, Can I still register?",
    answer:(
      <ul>
        <li>
            Yes! As long as you have lived in Jersey City for at least 30 days you are able to register to vote here!
        </li>
        <li>
          All you need to provide is your SSN. Click the link below to go to the NJ voter registration site. It only takes 5 minutes!
        </li>
      </ul>
      
    )
  }
  ];

  return (
    <div className="d-flex flex-column align-items-center bg-light px-3 pt-5 w-100">
      <Card style={{ width: "100%", maxWidth: 600, marginBottom: "1rem" }}>
        <Card.Body>
         {/* <h2 className="text-center mb-4">Check Your Voter Registration</h2> */}

          {values.is_reg === true ? (
  <>
    <Card style={{ width: "100%", maxWidth: 500 }}>
      <Card.Body>
        <h2 className="text-center mb-4">You're Registered to Vote!</h2>

        <div className="p-3 mb-3 bg-success text-white rounded">
          <strong>Good news!</strong> You're registered to vote in Jersey City.
        </div>

        <div className="p-3 mb-3" style={{ backgroundColor: "#0d6efd1a", borderRadius: "0.5rem" }}>
          <strong>Upcoming Election:</strong> Tuesday, November 5, 2025.
          <br />
          <a
            href="/calendar-invite.ics"
            download
            className="btn btn-warning mt-2"
          >
            Add to Calendar
          </a>
        </div>

        {/*<div className="p-3 mb-3" style={{ backgroundColor: "#0d6efd1a", borderRadius: "0.5rem" }}>
          <strong>Get a Reminder:</strong> Want a text or call before the election?
          <br />
          <Button
            variant="light"
            className="mt-2"
            onClick={() => alert("Reminder feature coming soon!")}
          >
            Schedule a Reminder
          </Button>
          </div> */}

        <div className="p-3 mb-3" style={{ backgroundColor: "#0d6efd1a", borderRadius: "0.5rem" }}>
          <strong>Early Voting:</strong> October 25 – November 2, 2025.
          <br />
          <a
            href="https://nj.gov/state/elections/vote-early-voting.shtml"
            target="_blank"
            rel="noopener noreferrer"
            className="d-block mt-2 text-decoration-underline"
          >
            Learn more about early voting
          </a>
        </div>

        <div className="p-3 mb-3" style={{ backgroundColor: "#0d6efd1a", borderRadius: "0.5rem" }}>
          <strong>Vote by Mail:</strong>
          <ol className="mt-2 mb-2">
            <li>Download and complete the vote-by-mail application.</li>
            <li>Mail or deliver the application to your County Clerk.</li>
            <li>Receive your ballot by mail.</li>
            <li>Return your ballot via mail or drop box.</li>
          </ol>
          <a
            href="https://www.nj.gov/state/elections/vote-by-mail.shtml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-decoration-underline"
          >
            Mail-In Voting Instructions
          </a>
        </div>

        <div className="text-center mt-4">
          <a
            href="https://www.state.nj.us/state/elections/voter-registration.shtml"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success"
          >
            Check Your Voter Information
          </a>
        </div>
      </Card.Body>
    </Card>
  </>
) : (
  


            <>
              <FadeInTextSmallBold
                text="We couldn't confirm your registration status"
                delay={0.2}
              />
              <hr />
              <h4 className="text-center mb-3">How Can I Register?</h4>
              {faqItems.map((item, index) => (
                <div key={index} className="mb-3">
                  <button
                    className="btn btn-light w-100 text-start d-flex justify-content-between align-items-center"
                    onClick={() => toggleFaq(index)}
                  >
                    {item.question}
                    <span className={`transition-transform ${openFaqIndex === index ? "rotate-180" : ""}`}>
                      &#9660;
                    </span>
                  </button>
                  {openFaqIndex === index && (
                    <div className="p-3 border rounded-top-0 border-top-0">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
              <div className="text-center mt-4">
                <Button
                className="py-2"
                style={{ backgroundColor: "#1A1A2E", border: "none" }}
                  onClick={() => {
                    window.dataLayer.push({ event: 'button_click', button: 'Previous', step: 'Final' });
                    homePage();
                  }}
                >
                  Start Over
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Final;
