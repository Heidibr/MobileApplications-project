import React from 'react';
import SwitchNavigator from './src/components/navigation/SwitchNavigation'
import * as firebase from 'firebase';
import {firebaseConfig} from './config/firebaseConfig';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialize firebase
    firebase.initializeApp(firebaseConfig);
  }
  render(){
  return (
      <SwitchNavigator/>
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
