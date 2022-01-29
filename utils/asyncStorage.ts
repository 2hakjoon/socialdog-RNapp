import AsyncStorage from '@react-native-async-storage/async-storage';

interface IStoreData {
  key:string
  value:any
}

export const storeData = async ({key, value}:IStoreData) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(`${key}`, jsonValue)
  } catch (e) {
    console.log(e)
  }
}


interface IGetData {
  key:string
}

export const getData = async ({key}:IGetData) => {
  try {
    const value = await AsyncStorage.getItem(key)
    return value != null ? JSON.parse(value) : null;
  } catch(e) {
    console.log(e)
  }
}
