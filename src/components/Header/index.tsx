import React, { useContext } from 'react';
import Switch from 'react-switch';
import { ThemeContext } from 'styled-components';
import { shade } from 'polished';
import { Container } from './styles';
import { Navbar, NavbarItem } from '../Navbar/Navbar';

const navbarItems = [
  new NavbarItem("Home", "/"),
  new NavbarItem("Contact", "/contact/"),
  new NavbarItem("Sign In", "/customer/login/"),
  new NavbarItem("Sign Up", "/customer/register/"),
  new NavbarItem("All categories", "/categories"),
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