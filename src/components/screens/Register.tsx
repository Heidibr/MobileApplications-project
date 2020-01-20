import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    TouchableHighlight
} from "react-native";
import Todo from "../../Todo";
import firebase from 'firebase';
import * as Google from 'expo-google-app-auth';
import { Input, Button, Header, Icon} from 'react-native-elements';


class Register extends Component<any> {
  state = {
    name: '',
    email:'',
    password: ''
  }

  handleSignup = () => {
    const {email, password} = this.state
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function(result) {
        firebase
        .database()
        .ref('/users/' + result.user.uid)
        .set({
          mail: result.user.email,
          created_at: Date.now()
        })
        this.props.navigation.navigate('Todo', {user: result.user.uid})
      })
      .catch(error => console.log(error))
    }

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
              // We don't need to reauth the Firebase connection.
        return true;
        }
      }
    }
    return false;
  }

  onSignIn = (googleUser) => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          //ma kanskje endre id token
          googleUser.idToken,
          googleUser.accessToken
          );
          // Sign in with credential from the Google user.
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(function(result) {
            firebase
              .database()
              .ref('/users/' + result.user.uid)
              .set({
                gmail: result.user.email,
                created_at: Date.now()
              })              
            })
            .then(() => this.props.navigation.navigate('Todo'))
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
          } else {
            console.log('User already signed-in Firebase.');
          }
        }.bind(this)); 
      }

    signInWithGoogleAsync = async() => {
        try {
          const result = await Google.logInAsync({
            clientId: '145090313122-nfem2tqoupjp2r53enqason5ni5mtpuv.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
            behavior: 'web'
          });
            if (result.type === 'success') {
                this.onSignIn(result); //send user to signIn to registrate
                this.props.navigation.navigate('Todo');
                return result.accessToken;
          } else {
            return { cancelled: true };
          }
        } catch (e) {
          return { error: true };
        }
    }


    goBack = () =>{
      this.props.navigation.navigate('Login')
    }

    render() {
        return (
          <View style={styles.container}>
            <Header
                  centerComponent={{ text: 'Register New User', style: { color: 'grey' } }}
                  leftComponent={
                  <TouchableHighlight onPress={this.goBack}>
                    <Text style={{textDecorationLine: 'underline', color: 'grey'}}>Back</Text>
                  </TouchableHighlight>}
                  containerStyle={{
                    backgroundColor: '#D3D3D3',
                    justifyContent: 'space-around',
                    
                  }}
                  />
            <View style={styles.content}>
                <Text style = {{fontSize: 40, color: 'grey'}}>Register</Text>
                <Input
                    value={this.state.name}
                    onChangeText={ name => this.setState({ name })}
                    placeholder='name'
                />
                <Input
                    value={this.state.email}
                    onChangeText={ email => this.setState({ email })}
                    placeholder='email'
                    autoCapitalize='none'
                />
                <Input
                    value={this.state.password}
                    onChangeText={ password => this.setState({ password })}
                    placeholder='password'
                    secureTextEntry={true}
                />
                <Button 
                    title="Sign Up" onPress={() => this.handleSignup()}
                    buttonStyle={{borderRadius: 4, backgroundColor:'#3cb371', margin: 5}}>
                </Button>
            </View>
            </View>
        );
    }
}
export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3'
  },
    content: {
      flex: 1,
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#D3D3D3'
    }
});