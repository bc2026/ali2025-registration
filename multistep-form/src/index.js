import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import TestFinal from './TestFinal'; // import TestFinal instead of App
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TestFinal />
  </React.StrictMode>
);
