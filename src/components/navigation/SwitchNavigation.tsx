import React, { Component } from "react";
import {createSwitchNavigator, createAppContainer} from 'react-navigation';

import Login from '../screens/Login';
import Register from '../screens/Register';
import Todo from '../../Todo';

const SwitchNavigator = createSwitchNavigator(
    {
        Login: {screen: Login},
        Register: {screen: Register},
        Todo: {screen: Todo}
    },
    {
        initialRouteName: 'Login'
    }
)

export default createAppContainer(SwitchNavigator);