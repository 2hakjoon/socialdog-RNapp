import React from 'react';
import FdIcon from 'react-native-vector-icons/Foundation';

interface IFoundation {
  size: number;
  name: string;
}

function Foundation({size, name}: IFoundation) {
  return <FdIcon name={name} size={size} />;
}

export default Foundation;
