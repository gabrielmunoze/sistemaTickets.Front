// pages/_app.tsx
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../redux/store';
import '../styles/globals.css';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;

/* import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../redux/store';
import React from 'react';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp; */

