import firebase from 'firebase';
/*
import {
    API_KEY,
    AUTH_DOMAIN,
    DATABASE_URL,
    PROJECT_ID,
    MESSAGE_SENDER_ID,
    APP_ID
} from 'react-native-dotenv'
*/

const firebaseConfig = {
    apiKey: "AIzaSyBopJpsmNeUc1dq6oA6tTCbcjI97Kg7evU",
    authDomain: "loginandregisterauser.firebaseapp.com",
    databaseURL: "https://loginandregisterauser.firebaseio.com",
    projectId: "loginandregisterauser",
    storageBucket: "loginandregisterauser.appspot.com",
    messagingSenderId: "110096693499",
    appId: "1:110096693499:web:b0ace8765662e5666b185e",
    measurementId: "G-MXYEFYX3CC"
  };

  let Firebase = firebase.initializeApp(firebaseConfig);

  export default Firebase