import AsyncStorage from '@react-native-async-storage/async-storage';

interface IStoreData {
  key:string
  value:any
}

const storeData = async ({key, value}:IStoreData) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(`${key}`, jsonValue)
  } catch (e) {
    console.log(e)
  }
}


const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('@storage_Key')
    if(value !== null) {
      // value previously stored
    }
  } catch(e) {
    console.log(e)
  }
}
