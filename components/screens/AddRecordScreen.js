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
import {save} from '../localStorage';
import * as Keychain from 'react-native-keychain';

const AddRecordScreen = ({counter, setCounter}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [provider, setProvider] = useState('');
  const [isValueHidden, setValueHidden] = useState(true);
  const [isSnackVisible, setSnackVisible] = useState(false);
  const [snackText, setSnackText] = useState('');
  const [accessControl, setAccessControl] = useState(
    Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
    // null,
  );
  const [biometryType, setBiometryType] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSecurityIndex, setSelectedSecurityIndex] = useState(0);
  const [securityLevel, setSecurityLevel] = useState(
    // Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
    null,
  );
  const [selectedStorageIndex, setSelectedStorageIndex] = useState(0);
  const [storageSelection, setStorageSelection] = useState(
    // Keychain.STORAGE_TYPE.AES,
    null,
  );

  const handleValueHidden = () => {
    setValueHidden(!isValueHidden);
  };

  const handleAddRecord = async () => {
    if (username.length > 0 && password.length > 0 && provider.length > 0) {
      try {
        await save(
          username,
          password,
          provider,
          accessControl,
          securityLevel,
          storageSelection,
        );
      } catch (error) {
        console.log('error save item', error);
      } finally {
        setProvider('');
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
            onChangeText={usernames => setUsername(usernames)}
          />
          <HelperText>Username, Email, etc.</HelperText>
          <View style={styles.valueWrapper}>
            <TextInput
              style={styles.input}
              label="Value"
              value={password}
              onChangeText={passwords => setPassword(passwords)}
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
