import React, { useEffect } from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Main } from '@aragon/ui';

import './App.css';

import AppContainer from './components/AppContainer';
import ErrorModal from './components/ErrorModal';
import Routes from './Routes';

import store from './redux/store';
import { autoConnect } from './redux/eth/actions';

export default function App() {

  useEffect(() => {
    store.dispatch(autoConnect()).catch(console.error);
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Main
          assetsUrl={`${process.env.PUBLIC_URL}/aragon-ui`}
          theme="light"
          layout={false}
          scrollView={false}
        >
          <AppContainer>
            <ErrorModal />
            <Routes/>
          </AppContainer>
        </Main>
      </Router>
    </Provider>
  );
}
