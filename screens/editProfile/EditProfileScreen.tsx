import React from 'react';
import ProfileAvatar from '../components/ProfileAvatar';
import TextComp from '../components/TextComp';

function EditProfileScreen() {
  return (
    <>
      <ProfileAvatar url={undefined} />
      <TextComp text={'프로필셋팅'} />
    </>
  );
}

export default EditProfileScreen;
