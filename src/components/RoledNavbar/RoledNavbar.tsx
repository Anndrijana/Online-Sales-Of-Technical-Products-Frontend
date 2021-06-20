import { faBan, faHome, faListOl, faShoppingBasket, faSignInAlt, faSignOutAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Navbar, NavbarItem } from '../Navbar/Navbar';


interface RoledNavbarProperties {
    role: 'administrator' | 'visitor' | 'customer' ;
}

const signInAdmin =  (<div>
    <FontAwesomeIcon icon={ faBan } size="lg" color="#FFF"/> Administrator
  </div>) as any;
const signIn =  (<FontAwesomeIcon icon={ faSignInAlt } size="lg" color="#FFF"/>) as any;
const signOut =  (<FontAwesomeIcon icon={ faSignOutAlt } size="lg" color="#FFF"/>) as any;
const signUp =  (<FontAwesomeIcon icon={ faUserPlus } size="lg" color="#FFF"/>) as any;
const home =  (<FontAwesomeIcon icon={ faHome } size="lg" color="#FFF"/>) as any;
const cat =  (<FontAwesomeIcon icon={ faListOl } size="lg" color="#FFF"/>) as any;
const orders =  (<FontAwesomeIcon icon={ faShoppingBasket } size="lg" color="#FFF"/>) as any;

export default class RoledNavbar extends React.Component<RoledNavbarProperties> {

    render() {

        let navbarItems: NavbarItem[] = [];

        switch (this.props.role) {
            case 'administrator' : navbarItems = this.getAdministratorNavbarItems(); break;
            case 'visitor'       : navbarItems = this.getVisitorNavbarItems(); break;
            case 'customer'      : navbarItems = this.getUserNavbarItems(); break;
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
            new NavbarItem(signUp, "/customer/register/"),
            new NavbarItem(signIn, "/customer/login/"),
            new NavbarItem(signInAdmin, "/admin/login/"),
        ];
    }

    getUserNavbarItems(): NavbarItem[] {
        return [
            new NavbarItem(home, "/"),
            new NavbarItem(cat, "/categories/"),
            new NavbarItem(orders, "/customer/orders/"),
            new NavbarItem(signOut, "/customer/logout/"),
        ];
    }
}