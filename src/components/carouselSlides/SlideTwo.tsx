import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Img from './login.jpg';

const SContainer = styled.div`
  align-items: center;
  display: flex;
`;

const STextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 10px;
`;

const SlideTwo = () => (
  <SContainer>
    <STextWrapper>
      <h1>
        Start shopping...
      </h1>
      <p className="centerLink">
      <Link className="link5" to='/categories'>NOW</Link>
      </p>
    </STextWrapper>
    <img src={ Img } alt="" width="1000px"/>
  </SContainer>
);

export default SlideTwo;