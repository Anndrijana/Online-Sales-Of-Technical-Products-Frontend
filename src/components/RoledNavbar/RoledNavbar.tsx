import { faBan, faHome, faListOl, faShoppingBasket, faSignInAlt, faSignOutAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Navbar, NavbarItem } from '../Navbar/Navbar';


interface RoledNavbarProperties {
    role: 'administrator' | 'visitor' | 'customer' ;
}

const signInAdmin =  (<h6 className="faBan"> <FontAwesomeIcon icon={ faBan } size="lg" color="#FFF"/> &emsp;Administrator </h6>) as any;
const signIn =  (<h6 className="faSignInAlt"><FontAwesomeIcon icon={ faSignInAlt } size="lg" color="#FFF"/></h6>) as any;
const signOutCustomer =  (<h6 className="faSignOutAltCustomer"><FontAwesomeIcon icon={ faSignOutAlt } size="lg" color="#FFF"/></h6>) as any;
const signUp =  (<h6 className="faUserPlus"><FontAwesomeIcon icon={ faUserPlus } size="lg" color="#FFF"/></h6>) as any;
const home =  (<h6 className="faHome"><FontAwesomeIcon icon={ faHome } size="lg" color="#FFF"/></h6>) as any;
const cat =  (<h6 className="faListOl"><FontAwesomeIcon icon={ faListOl } size="lg" color="#FFF"/></h6>) as any;
const orders =  (<h6 className="faShoppingBasket"><FontAwesomeIcon icon={ faShoppingBasket } size="lg" color="#FFF"/></h6>) as any;
const signOut =  (<h6 className="faSignOutAlt"><FontAwesomeIcon icon={ faSignOutAlt } size="lg" color="#FFF"/></h6>) as any;

const catForVisitors =  (<h6 className="faListOl"><FontAwesomeIcon icon={ faListOl } size="lg" color="#FFF"/></h6>) as any;

export default class RoledNavbar extends React.Component<RoledNavbarProperties> {

    render() {

        let navbarItems: NavbarItem[] = [];

        switch (this.props.role) {
            case 'administrator' : navbarItems = this.getAdministratorNavbarItems(); break;
            case 'visitor'       : navbarItems = this.getVisitorNavbarItems(); break;
            case 'customer'      : navbarItems = this.getCustomerNavbarItems(); break;
        }

        let showShoppingCart = false;

        if (this.props.role === 'customer') {
            showShoppingCart = true;
        }

        return <Navbar items = { navbarItems } showShoppingCart = { showShoppingCart }></Navbar>
                 
    }

    getAdministratorNavbarItems(): NavbarItem[] {
        return [
            new NavbarItem(home, "/admin/home/"),
            new NavbarItem(signOut, "/admin/logout/"),
        ];
    }

    getVisitorNavbarItems(): NavbarItem[] {
        return [
            new NavbarItem(signInAdmin, "/admin/login/"),
            new NavbarItem(signIn, "/"),
            new NavbarItem(signUp, "/customer/register/"),
            new NavbarItem(catForVisitors, "/visitor/categories/"),
        ];
    }

    getCustomerNavbarItems(): NavbarItem[] {
        return [
            new NavbarItem(home, "/home"),
            new NavbarItem(cat, "/categories/"),
            new NavbarItem(orders, "/customer/orders/"),
            new NavbarItem(signOutCustomer, "/customer/logout/"),
        ];
    }
}