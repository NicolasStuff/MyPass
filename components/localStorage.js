import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

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

export let removeItem = async key => {
  try {
    return await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log('error', e);
  }
};

//KeychainStorage

export const save = async (
  username,
  password,
  provider,
  accessControl,
  securityLevel,
  storageSelection,
) => {
  try {
    console.log(
      'save',
      username,
      password,
      provider,
      accessControl,
      securityLevel,
      storageSelection,
    );
    let start = new Date();

    await Keychain.setGenericPassword(username, password, {
      accessControl: accessControl,
      securityLevel: securityLevel,
      storage: storageSelection,
      service: provider,
    });
    let end = new Date();

    // setUsername('');
    // setPassword('');
    // setStatus(
    //   `Credentials saved! takes: ${end.getTime() - start.getTime()} millis`,
    // );
    console.log('Credentials saved! takes: ', end.getTime() - start.getTime());
  } catch (e) {
    console.log('Could not save credentials,' + e);
  }
};

export const getAll = async () => {
  try {
    const result = await Keychain.getAllGenericPasswordServices();
    // setStatus(`All keys successfully fetched! Found: ${result.length} keys.`);
    // console.log('result', result);
    return result;
  } catch (err) {
    // setStatus('Could not get all keys. ' + err);
    console.log('error', err);
  }
};

export const load = async name => {
  try {
    const options = {
      authenticationPrompt: {
        title: 'Authentification Requise',
        subtitle: 'Pour lire le mot de passe, veuillez vous authentifier',
        description: 'Obligatoire',
        cancel: 'Cancel',
      },
      service: name,
    };
    const credentials = await Keychain.getGenericPassword(options);
    if (credentials) {
      console.log('credentials', credentials);
    } else {
      console.log('No credentials stored.');
    }
  } catch (err) {
    console.log('Could not load credentials. ' + err);
  }
};

export const reset = async () => {
  try {
    await Keychain.resetGenericPassword();
    console.log('Credentials reset!');
  } catch (err) {
    console.log('Could not reset credentials, ' + err);
  }
};

// export const ios_specifics = async () => {
//   try {
//     const reply = await Keychain.setSharedWebCredentials(
//       'server',
//       'username',
//       'password',
//     );
//     console.log(`setSharedWebCredentials: ${JSON.stringify(reply)}`);
//   } catch (err) {
//     Alert.alert('setSharedWebCredentials error', err.message);
//   }

//   try {
//     const reply = await Keychain.requestSharedWebCredentials();
//     console.log(`requestSharedWebCredentials: ${JSON.stringify(reply)}`);
//   } catch (err) {
//     Alert.alert('requestSharedWebCredentials error', err.message);
//   }
// };
