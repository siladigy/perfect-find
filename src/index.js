import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';
import "firebase/storage";
import {Provider} from 'react-redux';
import store from './redux/store'

 
const firebaseConfig = {
  apiKey: "AIzaSyAbfYIYmFtew67qSlqIALGaG4cRfFJIV5Y",
  authDomain: "perfect-find.firebaseapp.com",
  databaseURL: "https://perfect-find.firebaseio.com",
  projectId: "perfect-find",
  storageBucket: "perfect-find.appspot.com",
  messagingSenderId: "87684526323",
  appId: "1:87684526323:web:acecaacc925db51d558786",
  measurementId: "G-CBNRTWGXTG"
}

firebase.initializeApp(firebaseConfig)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
