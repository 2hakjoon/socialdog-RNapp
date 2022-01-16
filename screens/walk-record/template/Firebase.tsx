import React from 'react';
import {Pressable, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {trackingData} from '../../../utils/trackingData';

const usersCollection = firestore().collection('Users');
const walksCollection = firestore().collection('Walks');

function Firebase() {
  const uploadUserData = () => {
    usersCollection
      .doc('순대 고유아이디')
      .set({
        name: '순대',
        age: 5,
      })
      .then(() => {
        console.log('User added!');
      });
  };

  const uploadTrackingData = () => {
    walksCollection
      .doc('순대 고유아이디')
      .collection('오늘')
      .doc('1')
      .set({trackingData})
      .then(() => {
        console.log('walks added!');
      });
  };

  const readUserData = async () => {
    const res = await usersCollection.doc('순대 고유아이디').get();
    console.log(res);
  };
  const readTrackingData = async () => {
    const res = await walksCollection
      .doc('순대 고유아이디')
      .collection('오늘')
      .doc('1')
      .get();
    console.log(res);
  };

  return (
    <>
      <Pressable onPress={uploadUserData}>
        <Text>유저데이터업로드</Text>
      </Pressable>
      <Pressable onPress={uploadTrackingData}>
        <Text>산책데이터업로드</Text>
      </Pressable>
      <Pressable onPress={readUserData}>
        <Text>유저데이터불러오기</Text>
      </Pressable>
      <Pressable onPress={readTrackingData}>
        <Text>산책데이터불러오기</Text>
      </Pressable>
    </>
  );
}

export default Firebase;
