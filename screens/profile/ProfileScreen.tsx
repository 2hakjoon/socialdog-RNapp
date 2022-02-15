import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../module';
import {UseNavigationProp} from '../../routes';
import AntDesignIcon from '../components/Icons/AntDesign';
import EvilIcon from '../components/Icons/EvilIcons';
import ProfileAvatar from '../components/ProfileAvatar';
import TextComp from '../components/TextComp';

function ProfileScreen() {
  const user = useSelector((state: RootState) => state.auth.user);
  const naviation = useNavigation<UseNavigationProp<'ProfileTab'>>();

  const navigateToEditProfile = () => {
    naviation.navigate('EditProfile');
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.tobMenu} onPress={navigateToEditProfile}>
        <AntDesignIcon name="setting" size={50} />
      </TouchableOpacity>
      <View style={styles.avatarContainer}>
        <ProfileAvatar url={undefined} size={100} />
        {user?.username ? (
          <View style={styles.rowBox}>
            <TextComp text={'보호자:'} />
            <TextComp text={user.username} />
          </View>
        ) : (
          <TextComp text={'보호자이름을 설정해주세요.'} />
        )}
        {user?.dogName && <TextComp text={user.dogName} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
  },
  tobMenu: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    height: 200,
    widhth: '100%',
    alignItems: 'center',
    paddingVertical: 30,
  },
  rowBox: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
});

export default ProfileScreen;
