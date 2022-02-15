import {gql, useMutation} from '@apollo/client';
import React from 'react';
import {useForm} from 'react-hook-form';
import {Alert, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../module';
import {authHeader} from '../../utils/dataformat/graphqlHeader';
import {
  MEditProfile,
  MEditProfileVariables,
} from '../../__generated__/MEditProfile';
import BasicButton from '../components/BasicButton';
import FormInputBox from '../components/Input/FormInputBox';
import ProfileAvatar from '../components/ProfileAvatar';

const EDIT_PROFILE = gql`
  mutation MEditProfile(
    $username: String
    $dogname: String
    $password: String
  ) {
    editProfile(
      args: {username: $username, dogname: $dogname, password: $password}
    ) {
      ok
      error
    }
  }
`;

function EditProfileScreen() {
  const user = useSelector((state: RootState) => state.auth.user);
  const {control, formState, handleSubmit} = useForm<MEditProfileVariables>();
  const [editProfile] = useMutation<MEditProfile, MEditProfileVariables>(
    EDIT_PROFILE,
  );

  const onSubmit = async (formData: MEditProfileVariables) => {
    try {
      console.log(formData);
      const res = await editProfile({
        variables: {...formData},
        ...authHeader(user?.accessToken),
      });
      Alert.alert('변경 완료', '변경사항이 반영되었습니다.');
    } catch (e) {
      Alert.alert('오류', '사용자 정보 변경중에 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.wrapper}>
      <ProfileAvatar url={undefined} />
      <FormInputBox
        title="이름"
        name="username"
        control={control}
        rules={{
          required: '내용을 입력해주세요.',
        }}
        errors={formState.errors.username?.message}
        maxLength={20}
      />
      <FormInputBox
        title="강아지 이름"
        name="dogname"
        control={control}
        rules={{
          required: '내용을 입력해주세요.',
        }}
        errors={formState.errors.username?.message}
        maxLength={20}
      />
      {user?.loginStrategy === 'LOCAL' && (
        <FormInputBox
          title="이름"
          name="username"
          control={control}
          rules={{
            required: '내용을 입력해주세요.',
          }}
          errors={formState.errors.username?.message}
          maxLength={20}
        />
      )}
      <BasicButton title="변경하기" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: '10%',
  },
});

export default EditProfileScreen;
