import AsyncStorage from '@react-native-async-storage/async-storage';

export let setItem = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

export let getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (e) {
    console.log('error', e);
  }
};

export let multiGet = async keys => {
  try {
    return await AsyncStorage.multiGet(keys);
  } catch (e) {
    console.log('error', e);
  }
};
