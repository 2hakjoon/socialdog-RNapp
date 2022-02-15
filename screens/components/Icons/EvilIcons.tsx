import EVIocn from 'react-native-vector-icons/EvilIcons';
import React from 'react';
import {IconProps} from 'react-native-vector-icons/Icon';

function EvilIcon({name, color, size}: IconProps) {
  return <EVIocn name={name} color={color} size={size} />;
}

export default EvilIcon;
