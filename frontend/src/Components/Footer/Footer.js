const Footer = ({ step }) => {
    return (
      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
        Your information is kept secure.
        <br/>
        Step {step + 1} of 3
      </footer>

    );
  };
  
  export default Footer;
  
