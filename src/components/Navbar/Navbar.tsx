import React from "react";
import { Nav, Image } from "react-bootstrap";
import { HashRouter, Link } from "react-router-dom";
import './styles.css';
import Img from './buy.png';
import ShoppingCart from "../ShoppingCart/ShoppingCart";

export class NavbarItem {
    text: string = '';
    link: string = '#';

    constructor(text: string, link: string) {
        this.text = text;
        this.link = link;
    }
}

interface NavbarProp {
    items: NavbarItem[];
    showCart?: boolean;
}

interface NavbarState {
    items: NavbarItem[];
}

export class Navbar extends React.Component<NavbarProp> {
    state: NavbarState;
    
    constructor(props: Readonly<NavbarProp>) {
        super(props);

        this.state = {
            items: props.items,
        };
    }

    setItems(items: NavbarItem[]) {
        this.setState({
            items: items,
        });
    }

    render() {
        return (
        <Nav variant="pills">
            <Image className="img" src={ Img } />
            <HashRouter>
            { this.state.items.map(item => {
                return (
                    <Link to={ item.link } className="nav-link">
                        { item.text }
                    </Link>
                );
            })
            }
            <ShoppingCart></ShoppingCart>
            </HashRouter>
        </Nav>
        );
    }
}