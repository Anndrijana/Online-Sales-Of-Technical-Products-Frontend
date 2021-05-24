import React from 'react';
import Header from './components/Header';
import GlobalStyle from './styles/global';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import usePeristedState from './utils/usePersistedState';
import light from './styles/themes/light';
import dark from './styles/themes/dark';   

function LightDarkMode() {
  const [theme, setTheme] = usePeristedState<DefaultTheme>('theme', light);

  const toggleTheme = () => {
    setTheme(theme.title === 'light' ? dark : light);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <GlobalStyle />
        <Header toggleTheme={toggleTheme} />
      </div>
    </ThemeProvider>
  );
}

export default LightDarkMode;
