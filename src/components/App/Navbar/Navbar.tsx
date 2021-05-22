import React from "react";
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
            { this.state.items.map(item => {
                return (
                    <Nav.Link href={ item.link }>
                        { item.text }
                    </Nav.Link>
                );
            })
            }
        </Nav>
        );
    }
}