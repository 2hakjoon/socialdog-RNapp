import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {IconProps} from 'react-native-vector-icons/Icon';

function EntypoIcon({name, color, size}: IconProps) {
  return <Entypo name={name} color={color} size={size} />;
}

export default EntypoIcon;
