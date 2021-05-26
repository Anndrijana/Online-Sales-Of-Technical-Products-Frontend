import React, { useContext } from 'react';
import Switch from 'react-switch';
import { ThemeContext } from 'styled-components';
import { shade } from 'polished';
import { Container } from './styles';
import { Navbar, NavbarItem } from '../Navbar/Navbar';

const navbarItems = [
  new NavbarItem("Početna stranica", "/"),
  new NavbarItem("Informacije", "/info/"),
  new NavbarItem("Prijavi se", "/customer/login/"),
  new NavbarItem("Kategorija 1", "/category/1/"),
  new NavbarItem("Kategorija 5", "/category/5/"),
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