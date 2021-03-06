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
import LightDarkMode from './LightDarkMode';
import Home from './components/Home/Home';
import CustomerLogin from './components/CustomerLogin/Login';
import { CustomerRegistration } from './components/Registration/Registration';
import Categories from './components/Categories/Categories';
import SingleCategory from './components/SingleCategory/SingleCategory';
import Orders from './components/Orders/Orders';
import AdministratorLogin from './components/AdministratorLogin/Login';
import AdministratorHome from './components/AdministratorHome/AdministratorHome';
import AdministratorCategories from './components/AdministratorCategories/AdministratorCategories';
import AdministratorOrders from './components/AdministratorOrders/AdministratorOrders';
import { AdministratorSignOut } from './components/AdministratorSignOut/AdministratorSignOut';
import { CustomerSignOut } from './components/CustomerSignOut/CustomerSignOut';
import ProductInformation from './components/ProductInformation/ProductInformation';
import AdministratorProducts from './components/AdministratorProducts/AdministratorProducts';
import CategoriesForVisitors from './components/CategoriesForVisitors/CategoriesForVisitors';
import SingleCategoryForVisitors from './components/SingleCategoryForVisitors/SingleCategoryForVisitors';
import AdministratorImages from './components/AdministratorImages/AdministratorImages';

ReactDOM.render(
  <React.StrictMode>
    <LightDarkMode></LightDarkMode>
    <HashRouter>
      <Switch>
        <Route exact path="/home" component = { Home }></Route>
        <Route exact path="/" component = { CustomerLogin }></Route>
        <Route exact path="/customer/register" component = { CustomerRegistration }></Route>
        <Route exact path="/categories" component = { Categories }></Route>
        <Route exact path="/category/:id" component = { SingleCategory }></Route>
        <Route path="/product/:id" component = { ProductInformation } />
        <Route exact path="/customer/orders" component = { Orders }></Route>
        <Route exact path="/admin/login" component = { AdministratorLogin }></Route>
        <Route exact path="/admin/home" component = { AdministratorHome }></Route>
        <Route exact path="/admin/home/category" component = { AdministratorCategories }></Route>
        <Route exact path="/admin/home/order" component = { AdministratorOrders }></Route>
        <Route exact path="/admin/home/product" component = { AdministratorProducts }></Route>
        <Route exact path="/admin/logout" component = { AdministratorSignOut }></Route>
        <Route exact path="/customer/logout" component = { CustomerSignOut }></Route>
        <Route exact path="/visitor/categories" component = { CategoriesForVisitors }></Route>
        <Route exact path="/visitor/category/:id" component = { SingleCategoryForVisitors }></Route>
        <Route exact path="/admin/home/image/:id" component = { AdministratorImages }></Route>
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
