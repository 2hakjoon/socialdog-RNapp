import {gql, useApolloClient, useMutation} from '@apollo/client';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {Alert, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../module';
import {RootRouteProps, UseNavigationProp} from '../../routes';
import {authHeader} from '../../utils/dataformat/graphqlHeader';
import {
  MEditProfile,
  MEditProfileVariables,
} from '../../__generated__/MEditProfile';
import {ME} from '../auth/AuthScreen';
import BasicButton from '../components/BasicButton';
import FormInputBox from '../components/Input/FormInputBox';
import ProfilePhoto from '../components/ProfilePhoto';

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
  const {params: user} = useRoute<RootRouteProps<'EditProfile'>>();
  const navigation = useNavigation<UseNavigationProp<'ProfileTab'>>();
  const client = useApolloClient();
  const {control, formState, handleSubmit, setValue} =
    useForm<MEditProfileVariables>();
  const [editProfile] = useMutation<MEditProfile, MEditProfileVariables>(
    EDIT_PROFILE,
  );

  useEffect(() => {
    setValue('username', user.username);
    setValue('dogname', user.dogname);
  }, []);

  const goBackToProfile = () => {
    navigation.goBack();
  };

  const onSubmit = async (formData: MEditProfileVariables) => {
    try {
      console.log(formData);
      const res = await editProfile({
        variables: {...formData},
      });
      if (res.data?.editProfile.ok) {
        client.writeQuery({
          query: ME,
          data: {
            me: {
              __typename: 'CoreUserOutputDto',
              ok: true,
              data: {
                __typename: 'UserProfile',
                username: formData.username,
                dogname: formData.dogname,
                loginStrategy: user.loginStrategy,
                id: user.id,
              },
            },
          },
          variables: {id: 10},
        });
        Alert.alert('변경 완료', '변경사항이 반영되었습니다.', [
          {
            text: '확인',
            onPress: () => {
              goBackToProfile();
            },
          },
        ]);
      }
    } catch (e) {
      Alert.alert('오류', '사용자 정보 변경중에 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.wrapper}>
      <ProfilePhoto url={user.photo} />
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
