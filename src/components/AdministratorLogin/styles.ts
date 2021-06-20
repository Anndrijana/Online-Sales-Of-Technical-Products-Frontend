import styled from 'styled-components';

export const Button = styled.button`
display: inline-block;
margin-left: 35%;
margin-right: 50%;
margin-bottom: 5%;
width: 30%;
padding: 5px 15px;
font-size: 25px;
font-weight: bold;
cursor: pointer;
text-align: center;
text-decoration: border;
outline: none;
color: #fff;
background-color: #c62f66;
border: none;
border-radius: 10px;
box-shadow: 0 9px #999;
&:hover {background-color: #8C70A8};
&:active {
    background-color: #C62E65;
    box-shadow: 0 5px #666;
    transform: translateY(4px);
  };
`;