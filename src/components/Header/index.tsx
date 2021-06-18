import React, { useContext } from 'react';
import Switch from 'react-switch';
import { ThemeContext } from 'styled-components';
import { shade } from 'polished';
import { Container } from './styles';
import { Navbar, NavbarItem } from '../Navbar/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignInAlt, faUserPlus, faListOl, faShoppingBasket } from '@fortawesome/free-solid-svg-icons';

const signIn =  (<FontAwesomeIcon icon={ faSignInAlt } size="lg" color="#FFF"/>) as any;
const signUp =  (<FontAwesomeIcon icon={ faUserPlus } size="lg" color="#FFF"/>) as any;
const home =  (<FontAwesomeIcon icon={ faHome } size="lg" color="#FFF"/>) as any;
const cat =  (<FontAwesomeIcon icon={ faListOl } size="lg" color="#FFF"/>) as any;
const orders =  (<FontAwesomeIcon icon={ faShoppingBasket } size="lg" color="#FFF"/>) as any;

const navbarItems = [
  new NavbarItem(home, "/"),
  new NavbarItem(signIn, "/customer/login/"),
  new NavbarItem(signUp, "/customer/register/"),
  new NavbarItem(cat, "/categories"),
  new NavbarItem(orders, "/customer/orders"),
]

interface Props {
  toggleTheme(): void;
}

const Header: React.FC<Props> = ({ toggleTheme }) => {
  const { colors, title } = useContext(ThemeContext);

  return (
    <Container>
      <Navbar items={ navbarItems }></Navbar>
      <Switch
        onChange={toggleTheme}
        checked={title === 'dark'}
        checkedIcon={false}
        uncheckedIcon={false}
        height={10}
        width={30}
        handleDiameter={20}
        offColor={shade(0.15, colors.primary)}
        onColor={colors.secundary}
      />
    </Container>
  );
};

export default Header;