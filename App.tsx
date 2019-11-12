import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ApiKeys from './src/constants/ApiKeys';
import * as firebase from 'firebase';
//import HeaderApp from './src/components/HeaderApp';
import Main from './src/Main';

export default class App extends React.Component {
  // constructor(props) {
  //   super(props);
  //   // Initialize firebase
  //   firebase.initializeApp(ApiKeys.firebaseConfig);
  // }
  render(){
  return (
     // <HeaderApp/>
      <Main/> // Build TODO app
  );
}}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
