import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { Navbar, NavbarItem } from './components/Navbar/Navbar';
import { HashRouter, Switch, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Contact from './components/Contact/Contact';
import Login from './Login/Login';

const navbarItems = [
  new NavbarItem("Početna stranica", "/"),
  new NavbarItem("Informacije", "/info/"),
  new NavbarItem("Prijavi se", "/login/"),
]

ReactDOM.render(
  <React.StrictMode>
    <Navbar items={ navbarItems }></Navbar>
    <HashRouter>
      <Switch>
        <Route exact path="/" component = { Home }></Route>
        <Route exact path="/info" component = { Contact }></Route>
        <Route exact path="/login" component = { Login }></Route>
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
