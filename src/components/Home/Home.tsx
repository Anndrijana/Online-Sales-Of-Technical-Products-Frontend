import React from 'react';
import Carousel from "../Carousel/Carousel";
import SlideOne from '../carouselSlides/SlideOne';
import SlideTwo from '../carouselSlides/SlideTwo';
import SlideThree from '../carouselSlides/SlideThree';
import './styles.css';
import RoledNavbar from '../RoledNavbar/RoledNavbar';
import { Container } from 'react-bootstrap';

const Home: React.FC = () => {
  return (
    <Container>
    <RoledNavbar role="customer"></RoledNavbar>
    <div className="carousel">
      <Carousel>
        <SlideOne/>
        <SlideTwo/>
        <SlideThree/>
      </Carousel>
    </div>
    </Container>
  );
}

export default Home;
