import {gql, useApolloClient, useMutation} from '@apollo/client';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {UseControllerProps, useForm} from 'react-hook-form';
import {Alert, Button, StyleSheet, View} from 'react-native';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import {RootRouteProps, UseNavigationProp} from '../../routes';
import BasicButton from '../components/BasicButton';
import FormInputBox from '../components/Input/FormInputBox';
import UserProfilePhoto from '../components/profile-photo/UserProfilePhoto';
import {EditDogInputDto, FileType} from '../../__generated__/globalTypes';
import {AWS_S3_ENDPOINT} from '../../config';
import {
  MCreatePreSignedUrls,
  MCreatePreSignedUrlsVariables,
} from '../../__generated__/MCreatePreSignedUrls';
import {CREATE_PRESIGNED_URL} from '../../apollo-gqls/upload';
import {CREATE_DOG} from '../../apollo-gqls/dogs';
import {MCreateDog, MCreateDogVariables} from '../../__generated__/MCreateDog';
import SmallButton from '../components/SmallButton';
import DogProfilePhoto from '../components/profile-photo/DogProfilePhoto';

function EditDogProfileScreen() {
  const {params: user} = useRoute<RootRouteProps<'EditDogProfile'>>();
  const navigation = useNavigation<UseNavigationProp<'WalkTab'>>();
  const client = useApolloClient();
  const {control, formState, handleSubmit, setValue} =
    useForm<EditDogInputDto>();
  const [createDog] = useMutation<MCreateDog, MCreateDogVariables>(CREATE_DOG);

  const [createPreSignedUrl] = useMutation<
    MCreatePreSignedUrls,
    MCreatePreSignedUrlsVariables
  >(CREATE_PRESIGNED_URL);

  const [newPhoto, setNewPhoto] = useState<Asset>();

  useEffect(() => {
    // setValue('username', user.username);
    // setValue('dogname', user.dogname);
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
      const filename = `dogPhoto/${Date.now()}_${Math.random()}_${
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

  const onSubmit = async (formData: EditDogInputDto) => {
    //console.log(formData);
    try {
      const file = newPhoto ? await uploadPhotoToS3(newPhoto) : undefined;
      if (!formData.name) {
        return;
      }
      if (!file) {
        Alert.alert('사진 등록', '반려견 사진을 업로드해주세요.');
        return;
      }
      const res = await createDog({
        variables: {args: {name: formData.name, photo: file}},
      });
      console.log(res);
      if (res.data?.createDog.error) {
        Alert.alert('오류', res.data?.createDog.error);
        return;
      }
      await Alert.alert('반려견 등록 성공', '반려견 프로필이 등록되었습니다.', [
        {text: '확인', onPress: () => navigation.goBack()},
      ]);
    } catch (e) {
      Alert.alert('오류', '반려견 프로필 등록중 오류가 발생했습니다.');
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
    // console.log(result.assets?.[0]);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.photoContainer}>
        <DogProfilePhoto size={130} url={newPhoto?.uri} />
        <SmallButton title="사진등록" onPress={changeProfilePhoto} />
      </View>
      <View style={styles.inputWrapper}>
        <FormInputBox
          title="반려견 이름"
          name="name"
          control={control}
          rules={{
            required: '내용을 입력해주세요.',
          }}
          errors={formState.errors.name?.message}
          maxLength={20}
        />
      </View>
      <BasicButton title="저장하기" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    paddingVertical: 30,
    paddingHorizontal: 16,
    height: '100%',
  },
  photoContainer: {
    alignItems: 'center',
    height: 250,
    justifyContent: 'space-around',
  },
  inputWrapper: {
    height: 160,
    justifyContent: 'center',
  },
});

export default EditDogProfileScreen;
