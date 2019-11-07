import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ApiKeys from './constants/ApiKeys';
import * as firebase from 'firebase';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialize firebase
    firebase.initializeApp(ApiKeys.firebaseConfig);
  }
  render(){
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx</Text>
    </View>
  );
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
