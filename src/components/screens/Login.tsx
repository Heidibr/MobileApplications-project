import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet    
} from "react-native";
import { Input, Button, Icon} from 'react-native-elements';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';

class Login extends Component<any> {
    state = {
        email: '',
        password:'', 
        currentUser: null
    }
    handleLogin = () => {
        const {email, password} = this.state
        firebase.auth()
            .signInWithEmailAndPassword(email,password)
            .then((result) => {
              this.setState({currentUser: result.user.uid})
              firebase
                .database()
                .ref('/users/' + result.user.uid)
                .update({
                  last_logged_in: (new Date())
                });
              
              this.props.navigation.navigate('Main', {user: result.user.uid})
            })
            .catch(error => console.log(error))
    }

    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          console.log('Finne uid for google bruker!!', providerData)
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
          console.log('sjekk1')
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
                  .update({
                  last_logged_in: (new Date())
                });
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
            clientId: '145090313122-nfem2tqoupjp2r53enqason5ni5mtpuv.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
            behavior: 'web'
          });
            console.log('res!!!!!', result)
            if (result.type === 'success') {
                this.onSignIn(result); //send user to signIn to registrate
                firebase.auth().onAuthStateChanged((result) => {
                  if (result) {
                    // User logged in already or has just logged in.
                    this.props.navigation.navigate('Main', {user: result.uid});
                    console.log('SJEKK AV GOOOGLE SIGNED IN USER', result.uid);
                  } else {
                    // User not logged in or has just logged out.
                    console.log('Bruker logget ut')
                  }
                });
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
                <Text style = {{fontSize: 40, color: 'grey'}}>Welcome</Text>
                <Input
                    value={this.state.email}
                    onChangeText={ email => this.setState({email})}
                    placeholder='Email'
                    autoCapitalize='none'
                />
                <Input
                    value={this.state.password}
                    onChangeText={ password => this.setState({password})}
                    placeholder='Password'
                    secureTextEntry={true}
                />
                <Button
                    buttonStyle={{borderRadius: 4, backgroundColor:'#3cb371', margin: 5}}
                    title="Login" onPress={() => this.handleLogin()}>
                </Button>
                <Button
                    buttonStyle={{borderRadius: 4, margin: 5, backgroundColor:'grey'}}
                    title="Login With Google" onPress={() => this.signInWithGoogleAsync()}>
                </Button>
                <Button 
                    titleStyle={{textDecorationLine: 'underline', color: 'grey'}}
                    buttonStyle={{borderRadius: 4, backgroundColor:'transparent', margin: 5}}
                    title="Register User" onPress={() => this.props.navigation.navigate('Register')}>
                </Button>
            </View>
        );
    }
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D3D3D3'
    }, 
});