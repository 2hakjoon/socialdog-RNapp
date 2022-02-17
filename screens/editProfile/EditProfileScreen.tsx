import {gql, useApolloClient, useMutation} from '@apollo/client';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Alert, Button, StyleSheet, View} from 'react-native';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import {RootRouteProps, UseNavigationProp} from '../../routes';
import {
  MEditProfile,
  MEditProfileVariables,
} from '../../__generated__/MEditProfile';
import {ME} from '../auth/AuthScreen';
import BasicButton from '../components/BasicButton';
import FormInputBox from '../components/Input/FormInputBox';
import ProfilePhoto from '../components/ProfilePhoto';
import {ReactNativeFile} from 'apollo-upload-client';

const EDIT_PROFILE = gql`
  mutation MEditProfile(
    $username: String
    $dogname: String
    $password: String
    $file: Upload
  ) {
    editProfile(
      args: {username: $username, dogname: $dogname, password: $password}
      file: $file
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

  const [newPhoto, setNewPhoto] = useState<Asset>();

  useEffect(() => {
    setValue('username', user.username);
    setValue('dogname', user.dogname);
  }, []);

  const goBackToProfile = () => {
    navigation.goBack();
  };

  const checkAndGenerateFile = (file: Asset | undefined) => {
    if (file) {
      return new ReactNativeFile({
        uri: file.uri || '',
        name: Date.now() + '-' + user.id! + '.' + file.fileName?.split('.')[1]!,
        type: file.type,
      });
    }
    return null;
  };

  const onSubmit = async (formData: MEditProfileVariables) => {
    try {
      let file = checkAndGenerateFile(newPhoto);

      const res = await editProfile({
        variables: {
          ...formData,
          file,
        },
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
                photo: newPhoto ? newPhoto.uri : user.photo,
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
      } else {
        Alert.alert('변경 실패', '오류가 발생했습니다.', [
          {
            text: '확인',
          },
        ]);
      }
    } catch (e) {
      Alert.alert('오류', '사용자 정보 변경중에 오류가 발생했습니다.');
    }
  };

  const changeProfilePhoto = async () => {
    // You can also use as a promise without 'callback':
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (!result.didCancel) {
      setNewPhoto(result.assets?.[0]);
    }
    //console.log(result.assets?.[0]);
  };

  return (
    <View style={styles.wrapper}>
      <ProfilePhoto url={newPhoto?.uri || user.photo} />
      <Button title="프사변경" onPress={changeProfilePhoto} />
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
