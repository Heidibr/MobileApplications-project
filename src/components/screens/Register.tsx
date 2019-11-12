import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from "react-native";
import Firebase from "../../../config/firebaseConfig";
import HeaderApp from "../HeaderApp";

class Register extends Component {
    state = {
        name: '',
        email:'',
        password: ''
    }

    handleSignup = () => {
        const { email, password} = this.state

        Firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(
            )
            .catch(error => console.log(error))
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
                <TouchableOpacity onPress={this.handleSignup}>
                    <Text>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>Sign Up with Google</Text>
                </TouchableOpacity>
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