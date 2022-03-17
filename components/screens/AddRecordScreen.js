import React, {useState} from 'react';

import {View, ScrollView, StyleSheet, Platform} from 'react-native';
import {
  Headline,
  TextInput,
  HelperText,
  Button,
  IconButton,
  Snackbar,
} from 'react-native-paper';
import {setItem} from '../localStorage';
import {save} from '../localStorage';
import * as Keychain from 'react-native-keychain';

const ACCESS_CONTROL_OPTIONS = ['None', 'Passcode', 'Password'];
const ACCESS_CONTROL_OPTIONS_ANDROID = ['None'];
const ACCESS_CONTROL_MAP = [
  null,
  Keychain.ACCESS_CONTROL.DEVICE_PASSCODE,
  Keychain.ACCESS_CONTROL.APPLICATION_PASSWORD,
  Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
];
const ACCESS_CONTROL_MAP_ANDROID = [
  null,
  Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
];
const SECURITY_LEVEL_OPTIONS = ['Any', 'Software', 'Hardware'];
const SECURITY_LEVEL_MAP = [
  Keychain.SECURITY_LEVEL.ANY,
  Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
  Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
];

const SECURITY_STORAGE_OPTIONS = ['Best', 'FB', 'AES', 'RSA'];
const SECURITY_STORAGE_MAP = [
  null,
  Keychain.STORAGE_TYPE.FB,
  Keychain.STORAGE_TYPE.AES,
  Keychain.STORAGE_TYPE.RSA,
];

const AddRecordScreen = ({counter, setCounter}) => {
  const VALUES =
    Platform.OS === 'ios'
      ? ACCESS_CONTROL_OPTIONS
      : ACCESS_CONTROL_OPTIONS_ANDROID;
  const AC_MAP =
    Platform.OS === 'ios' ? ACCESS_CONTROL_MAP : ACCESS_CONTROL_MAP_ANDROID;
  const SL_MAP = Platform.OS === 'ios' ? [] : SECURITY_LEVEL_MAP;
  const ST_MAP = Platform.OS === 'ios' ? [] : SECURITY_STORAGE_MAP;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [provider, setProvider] = useState('');
  const [isValueHidden, setValueHidden] = useState(true);
  const [isSnackVisible, setSnackVisible] = useState(false);
  const [snackText, setSnackText] = useState('');
  const [accessControl, setAccessControl] = useState(
    ACCESS_CONTROL_MAP_ANDROID,
  );
  const [biometryType, setBiometryType] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSecurityIndex, setSelectedSecurityIndex] = useState(0);
  const [securityLevel, setSecurityLevel] = useState(
    Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
  );
  const [selectedStorageIndex, setSelectedStorageIndex] = useState(0);
  const [storageSelection, setStorageSelection] = useState(
    Keychain.STORAGE_TYPE.AES,
  );

  const handleValueHidden = () => {
    setValueHidden(!isValueHidden);
  };
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + min;
  };

  const handleAddRecord = async () => {
    if (username.length > 0 && password.length > 0 && provider.length > 0) {
      const id = new Date().getTime() + getRandomInt(10000, 100000);
      const time = new Date().toLocaleDateString();

      let obj = {
        id,
        username,
        password,
        time,
      };
      try {
        // await setItem(id.toString(), JSON.stringify(obj));
        await save(
          username,
          password,
          provider,
          accessControl,
          securityLevel,
          storageSelection,
        );
      } catch (error) {
        console.log('error setItem', error);
      } finally {
        setItem('');
        setUsername('');
        setPassword('');
        setCounter(counter + 1);
      }
      setSnackText('New record added');
      setSnackVisible(true);
    } else {
      setSnackText('Invalid Key/Value');
      setSnackVisible(true);
    }
  };

  return (
    <>
      <ScrollView style={styles.wrapper}>
        <Headline style={styles.title}>Add new record</Headline>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            label="Provider"
            value={provider}
            onChangeText={text => setProvider(text)}
          />
          <HelperText>Google, Facebook, etc.</HelperText>
          <TextInput
            style={styles.input}
            label="Username"
            value={username}
            onChangeText={text => setUsername(text)}
          />
          <HelperText>Username, Email, etc.</HelperText>
          <View style={styles.valueWrapper}>
            <TextInput
              style={styles.input}
              label="Value"
              value={password}
              onChangeText={text => setPassword(text)}
              secureTextEntry={isValueHidden}
            />
            <HelperText>Password, Some secret, etc.</HelperText>
            <View style={styles.viewButton}>
              <IconButton
                icon={isValueHidden ? 'eye' : 'eye-off'}
                onPress={handleValueHidden}
              />
            </View>
          </View>
        </View>
        <Button
          style={styles.addButton}
          mode="contained"
          onPress={handleAddRecord}>
          Add
        </Button>
      </ScrollView>
      <Snackbar
        visible={isSnackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={2000}>
        {snackText}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    margin: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  input: {
    marginTop: 15,
  },
  valueWrapper: {
    position: 'relative',
  },
  viewButton: {
    position: 'absolute',
    right: 10,
    top: 26,
    zIndex: 9,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  addButton: {
    marginBottom: 20,
  },
});

export default AddRecordScreen;
