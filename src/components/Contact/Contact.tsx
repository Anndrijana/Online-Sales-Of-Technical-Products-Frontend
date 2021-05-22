import React from 'react';
import { Card, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons'

export default class Contact extends React.Component {
    render() {
        return (
            <Container>
                <Card>
                    <Card.Body>
                    <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>
                    Contact details
                    </Card.Body>
                    <Card.Text>
                        Contact details will be show here...
                    </Card.Text>
                </Card>
             
            </Container>
        );
    }
}
