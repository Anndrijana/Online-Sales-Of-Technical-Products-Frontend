import React from 'react';
import Carousel from "../Carousel/Carousel";
import SlideOne from '../carouselSlides/SlideOne';
import SlideTwo from '../carouselSlides/SlideTwo';
import SlideThree from '../carouselSlides/SlideThree';
import './styles.css';

const Home: React.FC = () => {
  return (
    <div className="carousel">
      <Carousel>
        <SlideOne/>
        <SlideTwo/>
        <SlideThree/>
      </Carousel>
    </div>
  );
}

export default Home;
