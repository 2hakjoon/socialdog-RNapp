import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../module';
import AntDesignIcon from '../components/Icons/AntDesign';
import EvilIcon from '../components/Icons/EvilIcons';
import TextComp from '../components/TextComp';

function ProfileScreen() {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <View style={styles.wrapper}>
      <View style={styles.tobMenu}>
        <AntDesignIcon name="setting" size={50} />
      </View>
      <View style={styles.avatarContainer}>
        <EvilIcon name="user" size={100} />
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
