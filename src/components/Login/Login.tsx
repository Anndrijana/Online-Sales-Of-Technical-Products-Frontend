import React from 'react';
import { Container, Form, Card, Col, Alert, Image  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import api, { ApiResponse, saveToken, saveRefreshToken } from '../../api/api';
import { Redirect } from 'react-router-dom';
import { Button } from './styles';
import Img from './login.jpg';
import './styles.css';

interface CustomerLoginState {
    email: string;
    password: string;
    errorMessage: string;
    isLoggedIn: boolean;
}

export default class CustomerLogin extends React.Component {
    state: CustomerLoginState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            email: '',
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
            'auth/customer/login',
            'post',
            {
                email: this.state.email,
                password: this.state.password,
            }
        )
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                this.setErrorMessage('System error... Try again!');

                return;
            }

            if (res.status === 'ok') {
                if ( res.data.statusCode !== undefined ) {
                    let message = '';

                    switch (res.data.statusCode) {
                        case -3001: message = 'Unkwnon e-mail!'; break;
                        case -3002: message = 'Bad password!'; break;
                    }

                    this.setErrorMessage(message);

                    return;
                }

                saveToken('customer', res.data.token);
                saveRefreshToken('customer', res.data.refreshToken);

                this.setLogginState(true);
            }
        });
    }

    render() {
        if (this.state.isLoggedIn === true) {
            return (
                <Redirect to="/customer/login" />
            );
        }

        return (
            <Container>
            
                <Col md={ { span: 5, offset: 17 } }>
                    <Card className="form">

                        <Card.Title className="title">
                                <FontAwesomeIcon icon={ faSignInAlt } color="#c62f66"/> Sign In
                        </Card.Title>
                    
                        <Image src= {Img} roundedCircle />
            
                        <Card.Body>        

                            <Form>
                            
                                <Form.Group>
        
                                    <Form.Label className="label" htmlFor="email">E-mail address:</Form.Label>
                                    <Form.Control type="email" id="email" placeholder= "📧 Type your e-mail address" 
                                                    value={ this.state.email }
                                                    onChange={ event => this.formInputChanged(event as any) } />
                                    <Form.Text className="text-muted">
                                        We'll never share your e-mail with anyone else.
                                    </Form.Text>
                               
                                </Form.Group>
                                
                                <Form.Group>
                                    <Form.Label className="label" htmlFor="password">Password:</Form.Label>
                                    <Form.Control type="text" id="password" placeholder="&#x1F513; Type your password"
                                                    value={ this.state.password }
                                                    onChange={ event => this.formInputChanged(event as any) }/>
                                </Form.Group>

                                <Button
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