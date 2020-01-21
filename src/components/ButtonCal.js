import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { lighterWhite } from '../utils/Colors';

const ButtonCal = ({ deleteAllItems }) => (
	<TouchableOpacity onPress={deleteAllItems}>
		<AntDesign name="delete-sweep" size={24} color={lighterWhite} />
	</TouchableOpacity>
);

export default Button;