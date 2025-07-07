import React from 'react';
//import { motion } from 'framer-motion';

const FadeInTextLarge = ({ text, delay = 0.2, duration = 0.8 }) => {
  return (
  /*  <motion.p
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay, duration }}
  style={{ fontSize: '32px', textAlign: 'center' }}
>
  {text}
</motion.p> */
<p style={{ fontSize: '32px', textAlign: 'center' }}>
{text}
</p>
 );
};

export default FadeInTextLarge;
