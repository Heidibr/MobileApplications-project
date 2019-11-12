import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from "react-native";
import Firebase from "../../../config/firebaseConfig";

class Login extends Component<any> {
    state = {
        email: '',
        password:''
    }

    handleLogin = () => {
        const {email, password} = this.state
        Firebase.auth()
            .signInWithEmailAndPassword(email,password)
            .then(() => this.props.navigation.navigate('HeaderApp'))
            .catch(error => console.log(error))
    }
    
    render() {
        return (
            <View style={styles.container}>
                <Text>Login</Text>
                <TextInput
                    value={this.state.email}
                    onChangeText={ email => this.setState({email})}
                    placeholder='email'
                    autoCapitalize='none'
                />
                <TextInput
                    value={this.state.password}
                    onChangeText={ password => this.setState({password})}
                    placeholder='Password'
                    secureTextEntry={true}
                />
                <TouchableOpacity onPress={this.handleLogin}>
                    <Text>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>Login with Google</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                    <Text>Register User</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});