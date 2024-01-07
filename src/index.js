import React from 'react';
//import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

import './assets/main.css'; 
import './assets/tailwind.css';

import App from './App';

import { BrowserRouter as Router } from 'react-router-dom';


   createRoot(document.getElementById('root')).render(<Router><App /></Router>);

