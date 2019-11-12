import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    TextInput,
    Button
} from "react-native";
import Main from "../../Main";
import firebase from 'firebase';
import * as Google from 'expo-google-app-auth';

class Register extends Component<any> {
    state = {
        name: '',
        email:'',
        password: ''
    }

    handleSignup = () => {
        const { email, password} = this.state

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(
            )
            
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
                    .auth()
                    .signInAndRetrieveDataWithCredential(credential)
                    .then(function(result) {
                    console.log('user signed in ');
                    firebase
                        .database()
                        .ref('/users/' + result.user.uid)
                        .set({
                          gmail: result.user.email,
                          profile_picture: result.additionalUserInfo.profile,
                          created_at: Date.now()
                        })
                  })
            })
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
            clientId: '1052881175304-390qapid19bugq6ee1t926o7ilniorru.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
            behavior: 'web'
          });
      
            if (result.type === 'success') {
                this.onSignIn(result); //send user to signIn to registrate
                this.props.navigation.navigate('Main');
                return result.accessToken;
          } else {
            return { cancelled: true };
          }
        } catch (e) {
          return { error: true };
        }
    }


    render() {
        return (
            <View style={styles.container}>
                <Text>Register</Text>
                <TextInput
                    value={this.state.name}
                    onChangeText={ name => this.setState({ name })}
                    placeholder='name'
                />
                <TextInput
                    value={this.state.email}
                    onChangeText={ email => this.setState({ email })}
                    placeholder='email'
                    autoCapitalize='none'
                />
                <TextInput
                    value={this.state.password}
                    onChangeText={ password => this.setState({ password })}
                    placeholder='password'
                    secureTextEntry={true}
                />
                <Button 
                    title="Sign Up" onPress={() => this.handleSignup()}>
                </Button>
                <Button 
                    title="Sign Up With Google" onPress={() => this.signInWithGoogleAsync()}>
                </Button>
            </View>
        );
    }
}
export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});