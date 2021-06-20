import React from 'react';
import { Container, Card, Col, Form, Row, Alert, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import Img from './register.jpg';
import { Button } from './styles';
import "./styles.css";
import RoledNavbar from '../RoledNavbar/RoledNavbar';

interface CustomerSignUpState {
    formData: {
        email: string;
        password: string;
        forename: string;
        surname: string;
        phoneNumber: string;
        address: string;
        city: string;
        postalAddress: string;
    };

    message?: string;

    signUpComplete: boolean;
}

export class CustomerRegistration extends React.Component {
    state: CustomerSignUpState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            signUpComplete: false,
            formData: {
                email: '',
                password: '',
                forename: '',
                surname: '',
                phoneNumber: '',
                address: '',
                city: '',
                postalAddress: '',
            },
        };
    }

    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const newFormData = Object.assign(this.state.formData, {
            [ event.target.id ]: event.target.value,
        });

        const newState = Object.assign(this.state, {
            formData: newFormData,
        });

        this.setState(newState);
    }

    render() {
        return (
            <Container>
                <RoledNavbar role="visitor"></RoledNavbar>
                
                <Col md={ { span: 7, offset: 2 } }>
                    <Card id="card">
                        
                        <Card.Body>
                            <Card.Title className="title">
                                <FontAwesomeIcon icon={ faUserPlus } color="#149dff"/> Sign Up
                            </Card.Title>
                           
                            {
                                (this.state.signUpComplete === false) ?
                                this.renderForm() : 
                                this.renderSignUpCompleteMessage()
                            }

                        </Card.Body>      
                        
                    </Card>
                </Col>
            </Container>
        );
    }

    private renderForm() {
        return (
            <>
                <Form>
                
                    <Row>
                    <Image src= {Img} roundedCircle height="300px"/>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label className="label" htmlFor="email">E-mail address:</Form.Label>
                                <Form.Control type="email" id="email" placeholder= "📧 Type your e-mail address"
                                            value={ this.state.formData.email }
                                            onChange={ event => this.formInputChanged(event as any) } />
                            </Form.Group>
                        </Col>

                        <Col md="6">
                            <Form.Group>
                                <Form.Label className="label" htmlFor="password">Password:</Form.Label>
                                <Form.Control type="password" id="password" placeholder="&#x1F513; Type your password"
                                                value={ this.state.formData.password }
                                                onChange={ event => this.formInputChanged(event as any) } />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label className="label" htmlFor="forename">Forename:</Form.Label>
                                <Form.Control type="text" id="forename" placeholder="Type your forename"
                                            value={ this.state.formData.forename }
                                            onChange={ event => this.formInputChanged(event as any) } />
                            </Form.Group>
                        </Col>

                        <Col md="6">
                            <Form.Group>
                                <Form.Label className="label" htmlFor="surname">Surname:</Form.Label>
                                <Form.Control type="text" id="surname" placeholder="Type your surname"
                                            value={ this.state.formData.surname }
                                            onChange={ event => this.formInputChanged(event as any) } />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                    <Col md="6">
                    <Form.Group>
                        <Form.Label className="label" htmlFor="phoneNumber">Phone number:</Form.Label>
                        <Form.Control type="phone" id="phoneNumber" placeholder="&#128222; Type your phone number"
                                      value={ this.state.formData.phoneNumber }
                                      onChange={ event => this.formInputChanged(event as any) } />
                    </Form.Group>
                    </Col>

                    <Col md="6">
                    <Form.Group>
                        <Form.Label className="label" htmlFor="address">Address:</Form.Label>
                        <Form.Control id="address" placeholder="&#127968; Type your address"
                                      as="textarea"  rows={ 1 }
                                      value={ this.state.formData.address }
                                      onChange={ event => this.formInputChanged(event as any) } />
                    </Form.Group>
                    </Col>
                    </Row>

                    <Row>
                    <Col md="6">
                    <Form.Group>
                        <Form.Label className="label" htmlFor="city">City:</Form.Label>
                        <Form.Control id="city" placeholder="Type your city"
                                      type="text"
                                      value={ this.state.formData.city }
                                      onChange={ event => this.formInputChanged(event as any) } />
                    </Form.Group>
                    </Col>

                    <Col md="6">
                    <Form.Group>
                        <Form.Label className="label" htmlFor="postalAddress">Postal address:</Form.Label>
                        <Form.Control id="postalAddress" placeholder="Type your postal address"
                                      type="text"
                                      value={ this.state.formData.postalAddress }
                                      onChange={ event => this.formInputChanged(event as any) } />
                    </Form.Group>
                    </Col>
                    </Row>

                    <p className="p">
                        Already have an account?<br/>
                        <Link className="link" to='/customer/login'>Sign In</Link>
                    </p>

                    <Form.Group>
                        <Button
                                onClick={ () => this.doSignUp() }>
                            Sign Up
                        </Button>
                    </Form.Group>

                </Form>
                <Alert variant="danger"
                        className={ this.state.message ? '' : 'd-none' }>
                    { this.state.message }
                </Alert>
            </>
        );
    }

    private renderSignUpCompleteMessage() {
        return (
            <p className="label">
            
                Welcome!<br />
                You have become a registered user.<br />
                <Link className="link" to='/customer/login'>Click here</Link> to go to the login page.
           
            </p>
        );
    }

    private doSignUp() {
        const data = {
            email: this.state.formData?.email,
            password: this.state.formData?.password,
            forename: this.state.formData?.forename,
            surname: this.state.formData?.surname,
            phoneNumber: this.state.formData?.phoneNumber,
            address: this.state.formData?.address,
            city: this.state.formData?.city,
            postalAddress: this.state.formData?.postalAddress
        };

        api('auth/customer/register/', 'put', data)
        .then((res: ApiResponse) => {
            console.log(res);

            if (res.status === 'error') {
                this.setErrorMessage('All fields are required!');
                return;
            }

            if ( res.data.statusCode !== undefined ) {
                this.handleErrors(res.data);
                return;
            }

            this.signUpComplete();
        })
    }

    private setErrorMessage(message: string) {
        const newState = Object.assign(this.state, {
            message: message,
        });

        this.setState(newState);
    }

    private handleErrors(data: any) {
        let message = '';

        switch (data.statusCode) {
            case -3006: message = 'This customer account cannot be created'; break;
            case -3007: message = 'Customer with this e-mail already exists'; break;
            case -3008: message = 'Customer with this phone already exists'; break;
        }

        this.setErrorMessage(message);
    }

    private signUpComplete() {
        const newState = Object.assign(this.state, {
            signUpComplete: true,
        });

        this.setState(newState);
    }
 }