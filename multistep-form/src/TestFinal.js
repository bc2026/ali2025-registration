// src/TestFinal.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import Final from './Components/Forms/Final';

const TestFinal = () => <Final values={{ is_reg: false }} />; // ✅ define it

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TestFinal />); // ✅ render it

export default TestFinal; // ✅ now this works

