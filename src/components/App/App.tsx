import React from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons'

function App() {
  return (
    <Container>
      <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
      Home
    </Container>
  );
}

export default App;
