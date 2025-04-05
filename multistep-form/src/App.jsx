import "./App.css";
import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import FadeInTextSmall from "./Components/FadeInText/FadeInTextSmall";
import FadeInTextLarge from "./Components/FadeInText/FadeInTextLarge";
import FadeInTextSmallBold from "./Components/FadeInText/FadeInTextSmallBold";
import Header  from "./Components/Header/Header";
import StepOne from "./Components/Forms/StepOne";
import StepTwo from "./Components/Forms/StepTwo";
import Final from "./Components/Forms/Final";
import Footer from "./Components/Footer/Footer";

function App() {
  //state for steps
  const [step, setstep] = useState(1);

  //state for form data
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_no: "",
    address: "",
    residence_zip: null,
    dob: null,
    is_reg: null
  })

  // function for going to next step by increasing step state by 1
  const nextStep = () => {
    setstep(step + 1);
  };

  // function for going to previous step by decreasing step state by 1
  const prevStep = () => {
    setstep(step - 1);
  };

  // handling form input data by taking onchange value and updating our previous form data state
  const handleInputData = input => e => {
    // input value from the form
    const {value } = e.target;

    //updating for data state taking previous state and then adding new value to create new object
    setFormData(prevState => ({
      ...prevState,
      [input]: value
  }));
  }


// javascript switch case to show different form in each step
  switch (step) {
    // case 1 to show stepOne form and passing nextStep, prevStep, and handleInputData as handleFormData method as prop and also formData as value to the fprm
    case 1:
      return (
        <>
        <Header/>
        <FadeInTextLarge text="Every voice counts!" delay={.2}/>
        <FadeInTextSmall text="Check your registration in just a minute." delay={1.2}></FadeInTextSmall>
        <FadeInTextSmallBold text= "We'll need your first and last name to get started" delay={2.2}></FadeInTextSmallBold>
        <div className="App">
          <Container>
            <Row>
              <Col  md={{ span: 6, offset: 3 }} className="custom-margin">
                <StepOne nextStep={nextStep} handleFormData={handleInputData} values={formData} />
              </Col>
            </Row>
          </Container>
          <Footer step={1}></Footer>
        </div>
        </>
      );
    // case 2 to show stepTwo form passing nextStep, prevStep, and handleInputData as handleFormData method as prop and also formData as value to the fprm
    case 2:
      return (
        <>
        <Header/>
        <FadeInTextSmallBold delay = {.2} text="Just a few more steps to stay in touch."></FadeInTextSmallBold>
        <FadeInTextSmallBold delay = {1.0} text="Don't worry, your data is safeguarded by us."></FadeInTextSmallBold>
        <div className="App">
          <Container>
            <Row>
              <Col  md={{ span: 6, offset: 3 }} className="custom-margin">
                <StepTwo nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} values={formData} />
              </Col>
            </Row>
          </Container>
          <Footer step={2}></Footer>
        </div>
        </>
      );
      // Only formData is passed as prop to show the final value at form submit
    case 3:
      return (
        <>
        <Header/>
        <div className="App">
          <Container>
            <Row>
              <Col  md={{ span: 6, offset: 3 }} className="custom-margin">
                <Final values={formData}  />
              </Col>
            </Row>
          </Container>
        </div>
        </>
      );
    // default case to show nothing
    default:
      return (
        <div className="App">
        </div>
      );
  }
}

export default App;
