import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER_ACCESS_TOKEN, USER_REFRESH_TOKEN, WEATHER_DATA} from './constants';

interface IStoreData {
  key: string;
  value: any;
}

export const storeData = async ({key, value}: IStoreData) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(`${key}`, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

interface IGetData {
  key: string;
}

export const getData = async ({key}: IGetData) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (e) {
    console.log(e);
  }
};

export const deleteTokens = async () => {
  await storeData({key: USER_ACCESS_TOKEN, value: null});
  await storeData({key: USER_REFRESH_TOKEN, value: null});
};

export const getAuthTokens = async (): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const accessToken = await getData({key: USER_ACCESS_TOKEN});
  const refreshToken = await getData({key: USER_REFRESH_TOKEN});
  return {accessToken, refreshToken};
};

export const storeWeatherData = async (data: {}) => {
  try {
    await storeData({key: WEATHER_DATA, value: data});
  } catch (e) {
    console.log(e);
  }
};

export const getWeatherData = async () => {
  try {
    return await getData({key: WEATHER_DATA});
  } catch (e) {
    console.log(e);
  }
};
