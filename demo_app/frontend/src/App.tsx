import './App.css'

import '@mantine/core/styles.css';

import { createTheme, MantineProvider, } from '@mantine/core';
import HomePage from './HomePage';

const theme = createTheme({
    defaultRadius: 'md',
});

function App() {

    return (
        <MantineProvider theme={theme}>
            <HomePage />
        </MantineProvider>
    )
}

export default App
