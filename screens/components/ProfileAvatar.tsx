import React from 'react';
import {Image} from 'react-native';
import EvilIcon from './Icons/EvilIcons';

interface IProfileAvatar {
  url: string | undefined;
  size: number;
}

function ProfileAvatar({url, size}: IProfileAvatar) {
  return (
    <>
      {url ? (
        <Image style={{width: size, height: size}} source={{uri: url}} />
      ) : (
        <EvilIcon name="user" size={size} />
      )}
    </>
  );
}

export default ProfileAvatar;
