import React from 'react';
import { Container, Form, Card, Col, Alert, Image  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import api, { ApiResponse, saveToken, saveRefreshToken, saveIdentity } from '../../api/api';
import { Redirect } from 'react-router-dom';
import { Button } from './styles';
import Img from './login.png';
import './styles.css';
import RoledNavbar from '../RoledNavbar/RoledNavbar';

interface AdministratorLoginState {
    username: string;
    password: string;
    errorMessage: string;
    isLoggedIn: boolean;
}

export default class AdministratorLogin extends React.Component {
    state: AdministratorLoginState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            username: '',
            password: '',
            errorMessage: '',
            isLoggedIn: false,
        }
    }

    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const newState = Object.assign(this.state, {
            [ event.target.id ]: event.target.value,
        });

        this.setState(newState);
    }

    private setErrorMessage(message: string) {
        const newState = Object.assign(this.state, {
            errorMessage: message,
        });

        this.setState(newState);
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private doLogin() {
        api(
            'auth/admin/login',
            'post',
            {
                username: this.state.username,
                password: this.state.password,
            }
        )
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                this.setErrorMessage('The field must not be empty... Try again!');

                return;
            }

            if (res.status === 'ok') {
                if ( res.data.statusCode !== undefined ) {
                    let message = '';

                    switch (res.data.statusCode) {
                        case -3003: message = 'You entered an unknown username!'; break;
                        case -3004: message = 'You entered the wrong password!'; break;
                    }

                    this.setErrorMessage(message);

                    return;
                }

                saveToken('administrator', res.data.token);
                saveRefreshToken('administrator', res.data.refreshToken);
                saveIdentity('administrator', res.data.identity);

                this.setLogginState(true);
            }
        });
    }

    render() {
        if (this.state.isLoggedIn === true) {
            return (
                <Redirect to="/admin/home" />
            );
        }

        return (
            <Container>
                <RoledNavbar role="visitor"></RoledNavbar>
                
                <Col md={ { span: 5, offset: 17 } }>
                    <Card className="form2">

                        <Card.Title className="title">
                                <FontAwesomeIcon icon={ faSignInAlt } color="#c62f66"/> Sign In
                        </Card.Title>
                        <div className="titleAC">For administrators only</div>
                    
                        <Image src= {Img} roundedCircle width="250px" style= {{"marginLeft": "180px"}}/>
            
                        <Card.Body>        

                            <Form>
                            
                                <Form.Group>
        
                                    <Form.Label className="label" htmlFor="username">Username:</Form.Label>
                                    <Form.Control type="username" id="username" placeholder= "📧 Type your username:" 
                                                    value={ this.state.username }
                                                    onChange={ event => this.formInputChanged(event as any) } />
                                </Form.Group>
                                
                                <Form.Group>
                                    <Form.Label className="label" htmlFor="password">Password:</Form.Label>
                                    <Form.Control type="password" id="password" placeholder="&#x1F513; Type your password"
                                                    value={ this.state.password }
                                                    onChange={ event => this.formInputChanged(event as any) }/>
                                </Form.Group>

                                <Button style= {{"marginTop": "20px"}}
                                    onClick={ () => this.doLogin() }>
                                    Sign In
                                </Button>
                                
                            </Form>

                            <Alert variant="danger"
                                   className={ this.state.errorMessage ? '' : 'd-none' }>
                                { this.state.errorMessage }
                            </Alert>

                        </Card.Body>
                    </Card>
                </Col>

            </Container>
        );
    }
}