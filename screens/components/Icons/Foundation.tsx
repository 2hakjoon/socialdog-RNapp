import React from 'react';
import FdIcon from 'react-native-vector-icons/Foundation';
import {IconProps} from 'react-native-vector-icons/Icon';

function Foundation({size, name, color, style}: IconProps) {
  return <FdIcon name={name} size={size} color={color} style={style} />;
}

export default Foundation;
