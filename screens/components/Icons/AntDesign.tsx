import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {IconProps} from 'react-native-vector-icons/Icon';

function AntDesignIcon({name, color, size}: IconProps) {
  return <AntDesign name={name} color={color} size={size} />;
}

export default AntDesignIcon;
