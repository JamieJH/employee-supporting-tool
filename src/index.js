import React from 'react';
import ReactDOM from 'react-dom';
import firebaseConfig from './firebaseConfig';
import firebase from 'firebase/app';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import App from './App';
import { store, persistor } from './redux/store';
import reportWebVitals from './reportWebVitals';
import './index.css';

firebase.initializeApp(firebaseConfig);


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
  ,
  document.getElementById('root')
);

reportWebVitals();
