import React from 'react';
import {Image} from 'react-native';
import EvilIcon from './Icons/EvilIcons';

interface IProfilePhoto {
  url: string | undefined | null;
  size?: number;
}

function ProfilePhoto({url, size = 100}: IProfilePhoto) {
  return (
    <>
      {url ? (
        <Image
          style={{width: size, height: size, borderRadius: size / 2}}
          source={{uri: url}}
        />
      ) : (
        <EvilIcon name="user" size={size} />
      )}
    </>
  );
}

export default ProfilePhoto;
