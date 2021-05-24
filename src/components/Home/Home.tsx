import React from 'react';
import { Card, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons'

export default class Contact extends React.Component {
    render() {
        return (
            <Container>
                <Card>
                    <Card.Body>
                    <FontAwesomeIcon icon={faHome}></FontAwesomeIcon>
                    Home details
                    </Card.Body>
                    <Card.Text>
                       Home details will be show here...
                    </Card.Text>
                </Card>
             
            </Container>
        );
    }
}