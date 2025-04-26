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
import { trackEvent } from "./trackEvent";

function App() {
  const [step, setstep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_no: "",
    address: "",
    residence_zip: null,
    dob: null,
    is_reg: null
  });

  const nextStep = () => {
    const next = step + 1;
    setstep(next);
    trackEvent('form_step_continue', { form_step: `step_${step}` });
  };

  const prevStep = () => {
    const previous = step - 1;
    setstep(previous);
    trackEvent('form_step_back', { form_step: `step_${step}` });
  };

  const handleInputData = input => e => {
    const { value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [input]: value
    }));
  }

  switch (step) {
    case 1:
      return (
        <>
        <Header/>
        <FadeInTextLarge text="Every voice counts!" delay={.2}/>
        <FadeInTextSmall text="Check your registration in just a minute." delay={1.2}></FadeInTextSmall>
        <FadeInTextSmallBold text="We'll need your first and last name to get started" delay={2.2}></FadeInTextSmallBold>
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
    case 2:
      return (
        <>
        <Header/>
        <FadeInTextSmallBold delay={.2} text="Just a few more steps to stay in touch."></FadeInTextSmallBold>
        <FadeInTextSmallBold delay={1.0} text="Don't worry, your data is safeguarded by us."></FadeInTextSmallBold>
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
    case 3:
      return (
        <>
        <Header/>
        <div className="App">
          <Container>
            <Row>
              <Col  md={{ span: 6, offset: 3 }} className="custom-margin">
                <Final values={formData} />
              </Col>
            </Row>
          </Container>
        </div>
        </>
      );
    default:
      return <div className="App"></div>;
  }
}

export default App;
