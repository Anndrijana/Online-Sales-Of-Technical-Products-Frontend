import * as React from "react";
import styled from "styled-components";
import { Image  } from 'react-bootstrap';
import Img from './slideOne.jpg';
import "./styles.css";

const SContainer = styled.div`
  align-items: center;
  display: flex;
`;

const STextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SlideOne = () => (
  <SContainer>
    <STextWrapper>
      <Image src={ Img } roundedCircle width="370px" height="370px"/>
      <h1 className="h1">
      Online sales of technical products
      </h1>
      <h5 className="h5">
      Store where know about Technology
      </h5>
    </STextWrapper>
  </SContainer>
);

export default SlideOne;