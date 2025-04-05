import React from 'react';
import { motion } from 'framer-motion';

const FadeInTextSmallBold = ({ text, delay = 0.2, duration = 0.8 }) => {
  return (
    <motion.p
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay, duration }}
  style={{ fontSize: '16px', textAlign: 'center', fontWeight: 'bold'}}
>
  {text}
</motion.p>
  );
};

export default FadeInTextSmallBold;
