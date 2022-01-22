import React from 'react';
import {Button, Text} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {routes} from '../../routes';

function WheatherScrean() {
  const navigation = useNavigation();
  return (
    <>
      <Text>여기는 날씨정보표시 페이지!</Text>
      <Button
        title="산책하러가기"
        onPress={() => {
          navigation.navigate(routes.record);
        }}
      />
      <Button
        title="산책 기록 보기"
        onPress={() => {
          navigation.navigate(routes.walkRecords);
        }}
      />
    </>
  );
}

export default WheatherScrean;
