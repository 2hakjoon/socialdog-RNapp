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
import BasicButton from '../components/BasicButton';
import FormInputBox from '../components/Input/FormInputBox';
import ProfilePhoto from '../components/ProfilePhoto';
import {FileType} from '../../__generated__/globalTypes';
import {AWS_S3_ENDPOINT} from '../../config';
import {
  MCreatePreSignedUrls,
  MCreatePreSignedUrlsVariables,
} from '../../__generated__/MCreatePreSignedUrls';
import {ME} from '../../apollo-gqls/auth';

const EDIT_PROFILE = gql`
  mutation MEditProfile(
    $username: String
    $dogname: String
    $password: String
    $photo: String
  ) {
    editProfile(
      args: {
        username: $username
        dogname: $dogname
        password: $password
        photo: $photo
      }
    ) {
      ok
      error
    }
  }
`;

const CREATE_PRESIGNED_URL = gql`
  mutation MCreatePreSignedUrls($files: [FileInputDto!]!) {
    createPreSignedUrls(args: {files: $files}) {
      ok
      urls
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
  const [createPreSignedUrl] = useMutation<
    MCreatePreSignedUrls,
    MCreatePreSignedUrlsVariables
  >(CREATE_PRESIGNED_URL);

  const [newPhoto, setNewPhoto] = useState<Asset>();

  useEffect(() => {
    setValue('username', user.username);
    setValue('dogname', user.dogname);
  }, []);

  const goBackToProfile = () => {
    navigation.goBack();
  };

  const getBlob = async (fileUri: string) => {
    const resp = await fetch(fileUri);
    const imageBody = await resp.blob();
    return imageBody;
  };

  const uploadPhotoToS3 = async (file: Asset) => {
    try {
      const blob = await getBlob(file.uri!);
      const filename = `userPhoto/${Date.now()}_${user.id}_${
        newPhoto?.fileName
      }`;

      const preSignedUrlData = await createPreSignedUrl({
        variables: {
          files: [
            {
              filename: filename,
              fileType: FileType.IMAGE,
            },
          ],
        },
      });
      const preSignedUrl = preSignedUrlData.data?.createPreSignedUrls.urls[0];
      if (!preSignedUrl) {
        throw new Error('preSignedUrl이 발급되지 않았습니다.');
      }

      const awsUploadresult = await fetch(preSignedUrl, {
        method: 'PUT',
        body: blob,
      });
      console.log(awsUploadresult);
      if (awsUploadresult.status !== 200) {
        throw new Error('파일 업로드 실패');
      }
      return AWS_S3_ENDPOINT + filename;
    } catch (e) {
      throw new Error('파일 업로드 실패');
    }
  };

  const onSubmit = async (formData: MEditProfileVariables) => {
    try {
      const file = newPhoto ? await uploadPhotoToS3(newPhoto) : undefined;

      const res = await editProfile({
        variables: {
          ...formData,
          photo: file,
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
                photo: file ? file : user.photo,
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
    const result = await launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 0.1,
    });
    if (!result.didCancel) {
      setNewPhoto(result.assets?.[0]);
    }
    console.log(result.assets?.[0]);
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
