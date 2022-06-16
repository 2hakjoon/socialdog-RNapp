import {useMutation, useQuery} from '@apollo/client';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {DELETE_DOG, GET_DOGS} from '../../../apollo-gqls/dogs';
import {UseNavigationProp} from '../../../routes';
import {
  QGetDogs,
  QGetDogs_getMyDogs_data,
} from '../../../__generated__/QGetDogs';
import BasicButton from '../../components/BasicButton';
import DogProfilePhoto from '../../components/profile-photo/DogProfilePhoto';
import TextComp from '../../components/TextComp';
import Carousel from 'react-native-snap-carousel';
import FontAwesomeIcon from '../../components/Icons/FontAwesome';
import AntDesignIcon from '../../components/Icons/AntDesign';
import {
  MDeleteDog,
  MDeleteDogVariables,
} from '../../../__generated__/MDeleteDog';
import useEvictCache from '../../../hooks/useEvictCache';
import {TypenameAndId} from '../../../apollo-setup';
import LoadingOverlay from '../../components/loading/LoadingOverlay';

const emptyDogProfile: QGetDogs_getMyDogs_data = {
  __typename: 'Dogs',
  id: '',
  birthDay: '',
  name: '',
  photo: '',
};

interface ISelectedDogTemplate {
  setSeletedDogId: Dispatch<SetStateAction<TypenameAndId | undefined>>;
}

function SelectDogTemplate({setSeletedDogId}: ISelectedDogTemplate) {
  const navigation = useNavigation<UseNavigationProp<'WalkTab'>>();

  const {data, refetch, loading: getDogsLoading} = useQuery<QGetDogs>(GET_DOGS);
  const evictCache = useEvictCache();
  const [dogsData, setDogsData] = useState<QGetDogs_getMyDogs_data[]>([
    emptyDogProfile,
  ]);

  const [deleteDog, {loading: deleteDogsLoading}] = useMutation<
    MDeleteDog,
    MDeleteDogVariables
  >(DELETE_DOG);

  //console.log(dogsData);
  const [slideIndex, setSlideIndex] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );
  useEffect(() => {
    const slicedDogsData = data?.getMyDogs.data
      ? data.getMyDogs.data.slice()
      : [];
    //마지막 자리는 새로운 반려견 추가 컴포넌트.
    if (slicedDogsData.length < 10) {
      slicedDogsData.push(emptyDogProfile);
    }
    setDogsData(slicedDogsData);
    setSeletedDogId({
      id: slicedDogsData[slideIndex].id,
      __typename: slicedDogsData[slideIndex].__typename,
    });
  }, [data]);

  const deleteDogProfileHandler = async (id: string, typename: string) => {
    Alert.alert('반려견 프로필 삭제', '반려견의 프로필을 삭제하시겠습니까?', [
      {text: '아니요', onPress: () => {}},
      {
        text: '네',
        onPress: async () => {
          const res = await deleteDog({variables: {args: {id}}});
          if (res.data?.deleteDog.error) {
            Alert.alert('오류', res.data?.deleteDog.error);
          }
          evictCache(id, typename);
        },
      },
    ]);
  };

  const moveToEditDogProfileScreen = () => {
    navigation.navigate('EditDogProfile');
  };

  const onCarouselSnap = (e: number) => {
    setSlideIndex(e);
    setSeletedDogId({id: dogsData[e].id, __typename: dogsData[e].__typename});
  };

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
          <View style={styles.dogsWrapper} key={item.id}>
            <TouchableOpacity
              style={styles.closeWrapper}
              onPress={() => deleteDogProfileHandler(item.id, item.__typename)}>
              <AntDesignIcon name="close" size={30} />
            </TouchableOpacity>
            <DogProfilePhoto size={150} url={item.photo} />
            <TextComp text={item.name} size={30} style={{paddingTop: 20}} />
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

  return (
    <>
      <View style={styles.wapper}>
        <View style={styles.InnerWrapper}>
          {getDogsLoading ? (
            <ActivityIndicator size={'large'} color={'black'} />
          ) : (
            <>
              {dogsData && (
                <Carousel
                  vertical={false}
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
                    <View style={{paddingHorizontal: 10}} key={Math.random()}>
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
            </>
          )}
        </View>
      </View>
      {deleteDogsLoading && <LoadingOverlay />}
    </>
  );
}

const styles = StyleSheet.create({
  wapper: {padding: 16},
  InnerWrapper: {
    paddingVertical: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'space-around',
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
    flex: 2,
    justifyContent: 'center',
  },
  buttonWrapper: {
    flex: 2,
    justifyContent: 'center',
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
