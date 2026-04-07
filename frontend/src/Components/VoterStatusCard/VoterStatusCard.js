import React from "react";
import "./VoterStatusCard.css";


const VoterStatusCard = ({ nextStep, goToStep }) => (
  <div className="voter-status-card">
    <h1 className="voter-status-headline">Can I Vote NJ — Congressional registration check</h1>
    <h2 className="voter-status-subheadline">See if you’re registered and which party is on file for your record</h2>
    <div className="voter-status-card-inner">
      <h3 className="voter-status-card-title">Quick lookup</h3>
      <p className="voter-status-card-desc">
        Enter your name and date of birth to match the public voter file. If you’re registered, we show your party affiliation and Congressional (U.S. House) district when available.
      </p>
      <button className="voter-status-btn main" onClick={nextStep}>Check My Registration Status</button>
      <div className="voter-status-small">30 seconds</div>
      <a
        href="https://voter.svrs.nj.gov/"
        target="_blank"
        rel="noopener noreferrer"
        className="voter-status-btn polling"
        style={{ textDecoration: 'none', display: 'block' }}
      >
        Find My Polling Location
      </a>
      <div className="voter-status-small">Official NJ Portal</div>
      <button className="voter-status-btn secondary" onClick={() => goToStep(3)}>I'm Not Registered</button>
      <div className="voter-status-small">Takes 2 minutes to register</div>
      <div className="voter-status-privacy">
        Your info is secure. We don’t store personal details unless you opt in.
      </div>
    </div>
  </div>
);

export default VoterStatusCard;
