import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  colors: {
    primary: {
      0: '#a4acd0',
      50: '#919bc6  ',
      100: '#7f8bbd ',
      200: '#6d7ab3 ',
      300: '#5a6aaa',
      400: '#5a6aaa ',
      500: '#4859a0',
      600: '#415090',
      700: '#3a4780 ',
      800: '#323e70',
      900: '#2b3560',
    },
  },
};

const theme = extendTheme(config);

export default theme;
