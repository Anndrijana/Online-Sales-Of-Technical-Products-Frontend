import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { HashRouter, Switch, Route } from 'react-router-dom';
import Contact from './components/Contact/Contact';
//import Login from './components/Login/Login';
import Category from './components/Category/Category';
import LightDarkMode from './LightDarkMode';
import Home from './components/Home/Home';
import CustomerLogin from './components/Login/Login';

ReactDOM.render(
  <React.StrictMode>
    <LightDarkMode></LightDarkMode>
    <HashRouter>
      <Switch>
        <Route exact path="/" component = { Home }></Route>
        <Route exact path="/contact" component = { Contact }></Route>
        <Route exact path="/customer/login" component = { CustomerLogin }></Route>
        <Route exact path="/category/:id" component = { Category }></Route>
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
