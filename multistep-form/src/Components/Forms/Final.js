import React, { useState } from "react";
import { Card } from "react-bootstrap";
import FadeInTextSmallBold from "../FadeInText/FadeInTextSmallBold";

const Final = ({ values }) => {

  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "What do I need to register online?",
      answer: (
        <ul>
          <li>Your Date of Birth</li>
          <li>One of the following forms of identification:
            <ul>
              <li>A valid New Jersey Driver's License or Non-driver ID Card</li>
              <li>Your Social Security Number (SSN)</li>
            </ul>
          </li>
          <li>If using your SSN, you must sign on-screen or upload your signature.</li>
        </ul>
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
          <li>You must register at least <strong>21 days before Election Day</strong> to vote.</li>
          <li>If registering by mail, ensure your form is postmarked by the deadline.</li>
        </ul>
      )
    }
  ];

  if (values.is_reg) {
    return (
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="max-w-2xl mx-auto p-5 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl text-center font-bold text-gray-800 mb-10">Voter Registration Status</h1>
          
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded" role="alert">
            <p className="font-bold text-2xl text-center">Good news! You're registered to vote in Jersey City.</p>
          </div>
  
            {/* Election Date Reminder + Calendar Invite */}
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <h2 className="font-bold text-lg">Upcoming Election</h2>
              <p>The next election is on <strong>Tuesday, November 5, 2024</strong>.</p>
              <a
                href="/calendar-invite.ics" // Replace with real link later
                download
                className="inline-block mt-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Add to Calendar
              </a>
            </div>
  
            {/* Schedule Reminder */}
            <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
              <h2 className="font-bold text-lg">Get a Reminder</h2>
              <p>Want a text or call reminder before the election?</p>
              <button 
                className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                onClick={() => alert("Reminder feature coming soon!")}
              >
                Schedule a Reminder
              </button>
            </div>
  
            {/* Early Voting Info */}
            <div className="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded">
              <h2 className="font-bold text-lg">Early Voting in Jersey City</h2>
              <p>Early voting begins <strong>Saturday, October 26</strong> and ends <strong>Sunday, November 3</strong>.</p>
              <p>You can vote early at your designated early voting location.</p>
              <a
                href="https://www.nj.gov/state/elections/vote-early.shtml"
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-indigo-600 hover:underline"
              >
                Learn more about early voting
              </a>
            </div>
  
            {/* Mail-in Voting Steps */}
            <div className="p-4 bg-pink-50 border-l-4 border-pink-500 rounded">
              <h2 className="font-bold text-lg">Vote by Mail</h2>
              <ol className="list-decimal ml-6 mt-2 text-gray-700">
                <li>Download and complete the vote-by-mail application from the NJ Elections site.</li>
                <li>Mail or deliver the application to your County Clerk.</li>
                <li>Once approved, you'll receive your ballot by mail.</li>
                <li>Return your ballot by mail or drop it off at a secure drop box.</li>
              </ol>
              <a
                href="https://www.nj.gov/state/elections/vote-by-mail.shtml"
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-pink-600 hover:underline"
              >
                Mail-In Voting Instructions
              </a>
            </div>
          </div>
  
          {/* Voter Info Link */}
          <div className="mt-8 text-center">
            <a 
              href="https://www.state.nj.us/state/elections/voter-registration.shtml" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Check Your Voter Information
            </a>
          </div>
        </div>
    );
  }
  

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-2xl mx-auto p-5 bg-white rounded-lg shadow-md mb-8">
        <h1 className="text-2xl text-center font-bold text-gray-800 mb-10">Check Your Voter Registration</h1>
        <FadeInTextSmallBold text="We couldn't confirm your registration status" delay={.2}></FadeInTextSmallBold>
      </div>

      <div className="max-w-2xl mx-auto p-5 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl text-center font-bold text-gray-800 mb-10">How Can I Register?</h1>
        
        {faqItems.map((item, index) => (
          <div key={index} className="mb-4">
            <button 
              className="bg-gray-200 w-full p-5 text-left text-lg font-medium rounded-t flex justify-between items-center"
              onClick={() => toggleFaq(index)}
            >
              {item.question}
              <span className={`transform transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                &#9660;
              </span>
            </button>
            <div 
              className="bg-white overflow-hidden transition-all duration-300"
              style={{ 
                maxHeight: openFaqIndex === index ? '500px' : '0',
                opacity: openFaqIndex === index ? 1 : 0
              }}
            >
              <div className="p-5 text-gray-600">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Final;
