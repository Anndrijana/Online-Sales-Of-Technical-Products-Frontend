import React from "react";
import { HashRouter, Link } from "react-router-dom";
import './styles.css';
import ShoppingCart from "../ShoppingCart/ShoppingCart";
import { Nav } from "react-bootstrap";


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
    showShoppingCart?: boolean;
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
            
            <Nav className="back-nav" variant="pills">
                
                <HashRouter>
                { this.state.items.map(item => {
                    return (
                        <Link to={ item.link } className="nav-link">
                            { item.text }
                        </Link>
                    );
                })
                }
                { this.props.showShoppingCart ? <ShoppingCart></ShoppingCart> : '' }
                </HashRouter>
            </Nav>
           
            );
    }
}