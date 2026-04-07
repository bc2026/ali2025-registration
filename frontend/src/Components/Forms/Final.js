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
          <li>Registration deadlines change each election — check the NJ Division of Elections for the current deadline</li>
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
          <strong>Good news!</strong> We found a registration record that matches your name and date of birth.
        </div>

        <div className="p-3 mb-3 border border-success rounded bg-white">
          <h5 className="mb-2">Congress & party (from this lookup)</h5>
          {values.party ? (
            <p className="mb-1">
              <strong>Party affiliation:</strong>{" "}
              <span style={{ textTransform: "capitalize" }}>{String(values.party).replace(/,/g, ", ")}</span>
            </p>
          ) : (
            <p className="mb-1 text-muted">Party affiliation: not listed in this file.</p>
          )}
          {values.district ? (
            <p className="mb-0">
              <strong>U.S. House (Congressional) district:</strong>{" "}
              <span style={{ textTransform: "capitalize" }}>{values.district}</span>
            </p>
          ) : (
            <p className="mb-0 text-muted">Congressional district: not listed in this file.</p>
          )}
          <p className="small text-muted mt-2 mb-0">
            Official confirmation is always through the{" "}
            <a href="https://voter.svrs.nj.gov/" target="_blank" rel="noopener noreferrer">
              NJ voter information portal
            </a>
            .
          </p>
        </div>

        <div className="p-3 mb-3" style={{ backgroundColor: "#0d6efd1a", borderRadius: "0.5rem" }}>
          <strong>Upcoming Election:</strong> Confirm dates with the{" "}
          <a href="https://www.nj.gov/state/elections/index.shtml" target="_blank" rel="noopener noreferrer">
            NJ Division of Elections
          </a>
          .
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
          <strong>Early voting:</strong> See current NJ early voting dates on the Division of Elections site.
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

        {/* Find my Polling Location section */}
        <div className="mt-4 mb-3">
          <h4>Find my Polling Location</h4>
          <ol className="text-start" style={{ maxWidth: 400, margin: '0 auto' }}>
            <li>Click the button below to visit the NJ Voter Portal.</li>
            <li>Enter your information to look up your polling place.</li>
            <li>Write down or save the address for Election Day.</li>
          </ol>
          <div className="text-center mt-2">
            <a
              href="https://voter.svrs.nj.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Find My Polling Location
            </a>
          </div>
        </div>
        <div className="text-center mt-4">
          <a
            href="https://ali2025.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success"
          >
            Learn About Your Candidates
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
              <div className="text-center mb-3">
                <a
                  href="https://voter.svrs.nj.gov/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-link p-0"
                  style={{ fontWeight: 600, color: '#1a73e8', textDecoration: 'underline' }}
                >
                  Register to Vote Online (NJ)
                </a>
              </div>
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
              <div className="text-center mt-4 d-flex flex-column flex-md-row justify-content-center gap-3">
                <a
                  href="https://voter.svrs.nj.gov/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary py-2 px-4"
                  style={{ minWidth: 160 }}
                  onClick={() => window.dataLayer.push({ event: 'button_click', button: 'Register Online', step: 'Final' })}
                >
                  Register Online
                </a>
                <Button
                  className="py-2 px-4 btn-secondary"
                  style={{ minWidth: 160 }}
                  onClick={() => {
                    window.dataLayer.push({ event: 'button_click', button: 'Start Over', step: 'Final' });
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
