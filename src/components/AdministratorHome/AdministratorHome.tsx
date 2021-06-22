import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { faListOl, faShoppingBag, faStore } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect, Link } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledNavbar from '../RoledNavbar/RoledNavbar';
import './AdministratorHome.css';
import Img from './login.jpg';

interface AdministratorHomeState {
    isAdministratorLoggedIn: boolean;
}

class AdministratorHome extends React.Component {
    state: AdministratorHomeState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
        };
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate() {
        this.getData();
    }

    private getData() {
        api('/api/administrator/', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }
        });
    }

    private setLogginState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        }));
    }

    render() {
        if (this.state.isAdministratorLoggedIn === false) {
            return (
                <Redirect to="/admin/login" />
            );
        }

        return (
            <Container>
                <RoledNavbar role="administrator"></RoledNavbar>

                <Card className="bg-dark text-white">
                    
                    <Card.Img className="opacity" src={Img} alt="Card image"/>
                
                        <Card.ImgOverlay>
                        <div className="adminHome">
                            Welcome to administrator home
                        </div>
        
                        <Card className="card1" style={{ width: '18rem' }}>
                            <Card.Body>
                            <Card.Title>
                            <FontAwesomeIcon icon={ faListOl } size="lg" color="#C62E65" /> Categories
                            </Card.Title>
                            <Card.Text className="text-categories">
                             Add, edit and delete categories
                             </Card.Text>
                             <Link className="link-2" to="/admin/home/category/">Click</Link>
                             </Card.Body>
                        </Card>
                        <Card className="card2" style={{ width: '18rem' }}>
                            <Card.Body>
                            <Card.Title>
                            <FontAwesomeIcon icon={ faStore } size="lg" color="#C62E65"/> Products
                            </Card.Title>
                            <Card.Text className="text-products">
                             Add, edit and delete products
                             </Card.Text>
                             <Link className="link-2" to="/admin/home/product/">Click</Link>
                             </Card.Body>
                        </Card>
                        <Card className="card3" style={{ width: '18rem' }}>
                            <Card.Body>
                            <Card.Title>
                            <FontAwesomeIcon icon={ faShoppingBag } size="lg" color="#C62E65"/> Orders
                            </Card.Title>
                            <Card.Text className="text-orders">
                             Add, edit and delete orders
                             </Card.Text>
                             <Link className="link-2" to="/admin/home/order/">Click</Link>
                             </Card.Body>
                        </Card>
                        </Card.ImgOverlay>
                </Card>

            </Container>
        );
    }
}

export default AdministratorHome;