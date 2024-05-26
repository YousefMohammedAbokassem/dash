import { BrowserRouter, HashRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { store } from './store';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
// import { StyledChart } from './components/chartt';
import ScrollToTop from './components/scroll-to-top';
import './styles.css';
// import { ApiProvider } from '@reduxjs/toolkit/dist/query/react';
// import { apiSlice } from './features/api/apiSlice';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <HashRouter>
        {/* <ApiProvider api={apiSlice}> */}
        <Provider store={store}>
          <ThemeProvider>
            <ScrollToTop />
            {/* <StyledChart /> */}
            <Router />
          </ThemeProvider>
        </Provider>
        {/* </ApiProvider> */}
      </HashRouter>
    </HelmetProvider>
  );
}
