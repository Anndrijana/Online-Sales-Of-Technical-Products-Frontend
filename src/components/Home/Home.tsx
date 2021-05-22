import React from 'react';
import './Home.css';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons'

function Home() {
  return (
    <Container>
      <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
      Home
    </Container>
  );
}

export default Home;
