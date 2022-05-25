import React from 'react';
import Octicons from 'react-native-vector-icons/Octicons';
import {IconProps} from 'react-native-vector-icons/Icon';

function OcticonsIcon({name, color, size}: IconProps) {
  return <Octicons name={name} color={color} size={size} />;
}

export default OcticonsIcon;
