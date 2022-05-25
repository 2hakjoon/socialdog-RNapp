import {useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {GET_DOGS} from '../../../apollo-gqls/dogs';
import {UseNavigationProp} from '../../../routes';
import {colors} from '../../../utils/colors';
import {
  QGetDogs,
  QGetDogs_getMyDogs_data,
} from '../../../__generated__/QGetDogs';
import BasicButton from '../../components/BasicButton';
import DogProfilePhoto from '../../components/profile-photo/DogProfilePhoto';
import TextComp from '../../components/TextComp';
import Carousel from 'react-native-snap-carousel';
import OcticonsIcon from '../../components/Icons/Octicons';
import EntypoIcon from '../../components/Icons/Entypo';
import FontAwesomeIcon from '../../components/Icons/FontAwesome';
import AntDesignIcon from '../../components/Icons/AntDesign';

const emptyDogProfile: QGetDogs_getMyDogs_data = {
  __typename: 'Dogs',
  id: '' + Math.random(),
  birthDay: '',
  name: '',
  photo: '',
};

function SelectDogTemplate() {
  const navigation = useNavigation<UseNavigationProp<'WalkTab'>>();

  const {data} = useQuery<QGetDogs>(GET_DOGS);
  const dogsData = data?.getMyDogs.data ? data.getMyDogs.data.slice() : [];
  //마지막 자리는 새로운 반려견 추가 컴포넌트.
  if (dogsData.length < 10) {
    dogsData.push(emptyDogProfile);
  }

  //console.log(dogsData);
  const [slideIndex, setSlideIndex] = useState<number>(0);

  const renderItem = ({
    item,
    index,
  }: {
    item: QGetDogs_getMyDogs_data;
    index: number;
  }) => {
    return (
      <>
        {item.photo.length ? (
          <View style={styles.dogsWrapper}>
            <View style={styles.closeWrapper}>
              <AntDesignIcon name="close" size={30} />
            </View>
            <DogProfilePhoto size={150} url={item.photo} />
            <TextComp text={item.name} size={30} />
          </View>
        ) : (
          <View style={styles.dogsWrapper}>
            <DogProfilePhoto size={150} />
            <View style={styles.textWrappr}>
              <TextComp text={'반려견의 프로필을 등록할 수 있어요!'} />
            </View>
            <View style={styles.buttonWrapper}>
              <BasicButton
                title="반려견 등록하기"
                onPress={() => {
                  moveToEditDogProfileScreen();
                }}
              />
            </View>
          </View>
        )}
      </>
    );
  };

  const moveToEditDogProfileScreen = () => {
    navigation.navigate('EditDogProfile');
  };

  const onCarouselSnap = (e: number) => {
    setSlideIndex(e);
  };

  return (
    <View style={styles.wapper}>
      <View style={styles.InnerWrapper}>
        {dogsData && (
          <Carousel
            data={dogsData}
            renderItem={renderItem}
            sliderWidth={300}
            itemWidth={300}
            onSnapToItem={e => onCarouselSnap(e)}
          />
        )}
        <View style={styles.dotsWrapper}>
          {dogsData.map((_, idx) => {
            return (
              <View style={{paddingHorizontal: 10}}>
                {idx === slideIndex ? (
                  <>
                    <FontAwesomeIcon name="circle" />
                  </>
                ) : (
                  <FontAwesomeIcon name="circle-o" />
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wapper: {padding: 16},
  InnerWrapper: {
    paddingVertical: 30,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    //ios
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1,
        shadowRadius: 30,
        shadowOffset: {
          height: 15,
          width: 0,
        },
      },
      //android
      android: {
        elevation: 5,
      },
    }),
  },
  textWrappr: {
    paddingTop: 60,
  },
  buttonWrapper: {
    paddingTop: 40,
    width: '60%',
  },
  dogsWrapper: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  dotsWrapper: {
    flexDirection: 'row',
  },
  closeWrapper: {
    width: '100%',
    alignItems: 'flex-end',
  },
});
export default SelectDogTemplate;
