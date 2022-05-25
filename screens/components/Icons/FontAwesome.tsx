import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {IconProps} from 'react-native-vector-icons/Icon';

function FontAwesomeIcon({name, color, size}: IconProps) {
  return <FontAwesome name={name} color={color} size={size} />;
}

export default FontAwesomeIcon;
