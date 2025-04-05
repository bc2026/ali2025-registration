const Footer = ({ step }) => {
    return (
      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
        Your information is kept secure and only used to verify your voter registration status.
        <br/>
        Step {step} of 2
      </footer>

    );
  };
  
  export default Footer;
  