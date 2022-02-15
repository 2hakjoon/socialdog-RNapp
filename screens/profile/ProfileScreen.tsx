import {useLazyQuery} from '@apollo/client';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {UseNavigationProp} from '../../routes';
import {QMe} from '../../__generated__/QMe';
import {ME} from '../auth/AuthScreen';
import AntDesignIcon from '../components/Icons/AntDesign';
import ProfileAvatar from '../components/ProfileAvatar';
import TextComp from '../components/TextComp';

function ProfileScreen() {
  //const user = useSelector((state: RootState) => state.auth.user);

  const [meQuery, {data}] = useLazyQuery<QMe>(ME);
  const user = data?.me.data;
  const naviation = useNavigation<UseNavigationProp<'ProfileTab'>>();

  const navigateToEditProfile = () => {
    naviation.navigate('EditProfile', {
      username: user?.username,
      dogname: user?.dogname,
      loginStrategy: user?.loginStrategy,
      id: user?.id,
    });
  };

  useEffect(() => {
    meQuery();
  }, []);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.tobMenu} onPress={navigateToEditProfile}>
        <AntDesignIcon name="setting" size={50} />
      </TouchableOpacity>
      <View style={styles.avatarContainer}>
        <ProfileAvatar url={undefined} size={100} />
        {data?.me?.data?.username ? (
          <View style={styles.rowBox}>
            <TextComp text={'보호자:'} />
            <TextComp text={data?.me?.data?.username} />
          </View>
        ) : (
          <TextComp text={'보호자이름을 설정해주세요.'} />
        )}
        {data?.me?.data?.dogname && <TextComp text={data?.me?.data?.dogname} />}
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
