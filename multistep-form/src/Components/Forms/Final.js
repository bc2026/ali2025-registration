
import React, { useEffect, useState } from "react";

const Final = ({ values }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    window.dataLayer.push({ event: 'form_step_view', step: 'Final', is_registered: values.is_reg });
  }, [values.is_reg]);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div>
      <h2>Voter Registration Status</h2>
      {values.is_reg ? <p>You are registered to vote.</p> : <p>We could not confirm your registration.</p>}
    </div>
  );
};

export default Final;
