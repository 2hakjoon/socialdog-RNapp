import React from 'react';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {IconProps} from 'react-native-vector-icons/Icon';

function MaterialCommunityIcons({name, color, size}: IconProps) {
  return <MaterialCommunity name={name} color={color} size={size} />;
}

export default MaterialCommunityIcons;
