import React, {Component, useEffect, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
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

const KeychainFunctionalComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  //   const [storage, setStorage] = useState(0);
  const [accessControl, setAccessControl] = useState(null);
  const [biometryType, setBiometryType] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSecurityIndex, setSelectedSecurityIndex] = useState(0);
  const [securityLevel, setSecurityLevel] = useState(null);
  const [selectedStorageIndex, setSelectedStorageIndex] = useState(0);
  const [storageSelection, setStorageSelection] = useState(null);

  useEffect(() => {
    Keychain.getSupportedBiometryType({}).then(biometryType => {
      setBiometryType(biometryType);
    });
  }, []);

  const save = async () => {
    try {
      let start = new Date();

      await Keychain.setGenericPassword(username, password, {
        accessControl: accessControl,
        securityLevel: securityLevel,
        storage: storageSelection,
      });
      let end = new Date();

      setUsername('');
      setPassword('');
      setStatus(
        `Credentials saved! takes: ${end.getTime() - start.getTime()} millis`,
      );
    } catch (e) {
      setStatus('Could not save credentials,' + e);
    }
  };

  //TRADUCTION:
  const load = async () => {
    try {
      const options = {
        authenticationPrompt: {
          title: 'Authentication needed',
          subtitle: 'Subtitle',
          description: 'Some descriptive text',
          cancel: 'Cancel',
        },
      };
      const credentials = await Keychain.getGenericPassword(options);
      if (credentials) {
        console.log('credentials', credentials);
        setStatus('Credentials loaded!');
      } else {
        setStatus('No credentials stored.');
      }
    } catch (err) {
      setStatus({status: 'Could not load credentials. ' + err});
    }
  };

  const reset = async () => {
    try {
      await Keychain.resetGenericPassword();
      setStatus('Credentials reset!');
      setUsername('');
      setPassword('');
    } catch (err) {
      setStatus({status: 'Could not reset credentials, ' + err});
    }
  };

  const getAll = async () => {
    try {
      const result = await Keychain.getAllGenericPasswordServices();
      setStatus(`All keys successfully fetched! Found: ${result.length} keys.`);
    } catch (err) {
      setStatus('Could not get all keys. ' + err);
    }
  };

  const ios_specifics = async () => {
    try {
      const reply = await Keychain.setSharedWebCredentials(
        'server',
        'username',
        'password',
      );
      console.log(`setSharedWebCredentials: ${JSON.stringify(reply)}`);
    } catch (err) {
      Alert.alert('setSharedWebCredentials error', err.message);
    }

    try {
      const reply = await Keychain.requestSharedWebCredentials();
      console.log(`requestSharedWebCredentials: ${JSON.stringify(reply)}`);
    } catch (err) {
      Alert.alert('requestSharedWebCredentials error', err.message);
    }
  };

  //FIN DE TRADUCTION

  const VALUES =
    Platform.OS === 'ios'
      ? ACCESS_CONTROL_OPTIONS
      : ACCESS_CONTROL_OPTIONS_ANDROID;
  const AC_MAP =
    Platform.OS === 'ios' ? ACCESS_CONTROL_MAP : ACCESS_CONTROL_MAP_ANDROID;
  const SL_MAP = Platform.OS === 'ios' ? [] : SECURITY_LEVEL_MAP;
  const ST_MAP = Platform.OS === 'ios' ? [] : SECURITY_STORAGE_MAP;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Keychain Example</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={username}
            // onSubmitEditing={() => {
            //   passwordTextInput.focus();
            // }}
            onChange={event => {
              setUsername(event.nativeEvent.text);
            }}
            underlineColorAndroid="transparent"
            blurOnSubmit={false}
            returnKeyType="next"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            password={true}
            autoCapitalize="none"
            value={password}
            // ref={input => {
            //   passwordTextInput = input;
            // }}
            onChange={event => setPassword(event.nativeEvent.text)}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Access Control</Text>
          <SegmentedControlTab
            selectedIndex={selectedIndex}
            values={biometryType ? [...VALUES, biometryType] : VALUES}
            onTabPress={index => {
              setAccessControl(AC_MAP[index]), setSelectedIndex(index);
            }}
          />
        </View>
        {Platform.OS === 'android' && (
          <View style={styles.field}>
            <Text style={styles.label}>Security Level</Text>
            <SegmentedControlTab
              selectedIndex={selectedSecurityIndex}
              values={SECURITY_LEVEL_OPTIONS}
              onTabPress={index => {
                setSecurityLevel(SL_MAP[index]),
                  setSelectedSecurityIndex(index);
              }}
            />

            <Text style={styles.label}>Storage</Text>
            <SegmentedControlTab
              selectedIndex={selectedStorageIndex}
              values={SECURITY_STORAGE_OPTIONS}
              onTabPress={index => {
                setStorageSelection(ST_MAP[index]),
                  setSelectedStorageIndex(index);
              }}
            />
          </View>
        )}
        {!!status && <Text style={styles.status}>{status}</Text>}

        <View style={styles.buttons}>
          <TouchableHighlight onPress={() => save()} style={styles.button}>
            <View style={styles.save}>
              <Text style={styles.buttonText}>Save</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => load()} style={styles.button}>
            <View style={styles.load}>
              <Text style={styles.buttonText}>Load</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => reset()} style={styles.button}>
            <View style={styles.reset}>
              <Text style={styles.buttonText}>Reset</Text>
            </View>
          </TouchableHighlight>
        </View>

        <View style={[styles.buttons, styles.centerButtons]}>
          <TouchableHighlight onPress={() => getAll()} style={styles.button}>
            <View style={styles.load}>
              <Text style={styles.buttonText}>Get Used Keys</Text>
            </View>
          </TouchableHighlight>
          {Platform.OS === 'android' && (
            <TouchableHighlight
              onPress={async () => {
                const level = await Keychain.getSecurityLevel();
                Alert.alert('Security Level', level);
              }}
              style={styles.button}>
              <View style={styles.load}>
                <Text style={styles.buttonText}>Get security level</Text>
              </View>
            </TouchableHighlight>
          )}
          {Platform.OS === 'ios' && (
            <TouchableHighlight
              onPress={() => ios_specifics()}
              style={styles.button}>
              <View style={styles.load}>
                <Text style={styles.buttonText}>Test Other APIs</Text>
              </View>
            </TouchableHighlight>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default KeychainFunctionalComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  content: {
    marginHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '200',
    textAlign: 'center',
    marginBottom: 20,
  },
  field: {
    marginVertical: 5,
  },
  label: {
    fontWeight: '500',
    fontSize: 15,
    marginBottom: 5,
  },
  input: {
    color: '#000',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    backgroundColor: 'white',
    height: 32,
    fontSize: 14,
    padding: 8,
  },
  status: {
    color: '#333',
    fontSize: 12,
    marginTop: 15,
  },
  biometryType: {
    color: '#333',
    fontSize: 12,
    marginTop: 15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    borderRadius: 3,
    padding: 2,
    overflow: 'hidden',
  },
  save: {
    backgroundColor: '#0c0',
  },
  load: {
    backgroundColor: '#333',
  },
  reset: {
    backgroundColor: '#c00',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
