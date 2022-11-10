import { ChakraProvider } from '@chakra-ui/react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter as Router } from 'react-router-dom';
import App from './App';
import theme from './theme';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <Router>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </Router>
);

// calling IPC exposed from preload script

window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
