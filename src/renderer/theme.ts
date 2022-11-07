import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  colors: {
    primary: {
      0: '#d8dae6',
      50: '#b0b5cc  ',
      100: '#9da3c0 ',
      200: '#8991b3 ',
      300: '#757ea6',
      400: '#4e598d ',
      500: '#3a4780',
      600: '#2e3966',
      700: '#232b4d ',
      800: '#1d2440',
      900: '#111526',
    },
  },
};

const theme = extendTheme(config);

export default theme;
