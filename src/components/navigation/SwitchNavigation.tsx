import React, { Component } from "react";
import {createSwitchNavigator, createAppContainer} from 'react-navigation';

import Login from '../screens/Login';
import Register from '../screens/Register';
import Main from '../../Main';

const SwitchNavigator = createSwitchNavigator(
    {
        Login: {screen: Login},
        Register: {screen: Register},
        Main: {screen: Main},
    },
    {
        initialRouteName: 'Login'
    }
)

export default createAppContainer(SwitchNavigator);