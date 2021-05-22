import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { Navbar, NavbarItem } from './components/App/Navbar/Navbar';

const navbarItems = [
  new NavbarItem("Početna", "/"),
  new NavbarItem("Kontakt", "/contact/"),
  new NavbarItem("Prijavi se", "/customer/login"),
]

ReactDOM.render(
  <React.StrictMode>
    <Navbar items={ navbarItems }></Navbar>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
