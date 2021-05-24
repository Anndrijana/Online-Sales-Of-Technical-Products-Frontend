import React from 'react';
import { Col, Button, Card, Container, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api, { ApiResponse, saveToken } from '../../api/api';
import { Redirect } from 'react-router-dom';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

interface LoginState {
    email: string;
    password: string;
    errorMessage: string;
    isLoggedIn: boolean;
}

export default class Login extends React.Component {
    state: LoginState;

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
               console.log(res.data);

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

                saveToken(res.data.token);

                this.setLogginState(true);
            }
        });
    }

    render() {
        if (this.state.isLoggedIn === true) {
            return (
                <Redirect to="/" />
            );
        }
        
        return (
            <Container>

                <Col md={ { span: 6, offset: 3 } }>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={ faSignInAlt } /> User Login
                            </Card.Title>
                            <Form>
                                <Form.Group>
                                    <Form.Label htmlFor="email">E-mail:</Form.Label>
                                    <Form.Control type="email" id="email"
                                                    value={ this.state.email }
                                                    onChange={ event => this.formInputChanged(event as any) } />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="password">Password:</Form.Label>
                                    <Form.Control type="password" id="password"
                                                    value={ this.state.password }
                                                    onChange={ event => this.formInputChanged(event as any) } />
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary"
                                            onClick={ () => this.doLogin() }>
                                        Log in
                                    </Button>
                                </Form.Group>
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