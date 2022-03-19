/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import {
  Surface,
  TextInput,
  Title,
  Caption,
  IconButton,
} from 'react-native-paper';
import Clipboard from '@react-native-community/clipboard';
import {load} from '../localStorage';

const RecordCard = ({provider, setSnackVisible, setSnackText}) => {
  const [isValueHidden, setValueHidden] = useState(true);
  const [credentials, setCredentials] = useState();

  const onload = async () => {
    let ret = await load(provider);
    setCredentials(ret);
  };

  const copyToClipboard = (text, type) => {
    Clipboard.setString(text);
    setSnackText(`Copied ${type} to Clipboard`);
    setSnackVisible(true);
  };

  return (
    <Surface style={styles.password}>
      <View style={{maxWidth: Dimensions.get('screen').width / 1.3}}>
        <TouchableOpacity onPress={() => copyToClipboard(provider, 'Provider')}>
          <Title>Provider : {provider}</Title>
        </TouchableOpacity>
        {!credentials && (
          <>
            <TouchableOpacity onPress={() => onload()}>
              <TextInput
                mode="outlined"
                style={{
                  backgroundColor: 'transparent',
                  width: Dimensions.get('window').width / 1.3,
                }}
                dense
                editable={false}
                focusable={false}
                value={'SHOW USERNAME AND PASSWORD'}
              />
            </TouchableOpacity>
          </>
        )}

        {credentials && (
          <>
            <TouchableOpacity
              onPress={() => copyToClipboard(credentials.username, 'Username')}
              style={styles.button}>
              <Text>Username :</Text>
              <TextInput
                mode="outlined"
                style={{
                  backgroundColor: 'transparent',
                  width: Dimensions.get('window').width / 1.3,
                }}
                dense
                editable={false}
                focusable={false}
                secureTextEntry={isValueHidden}
                value={credentials.username}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => copyToClipboard(credentials.password, 'Password')}
              style={styles.button}>
              <Text>Password :</Text>
              <TextInput
                mode="outlined"
                style={{
                  backgroundColor: 'transparent',
                  width: Dimensions.get('window').width / 1.3,
                }}
                dense
                editable={false}
                focusable={false}
                secureTextEntry={isValueHidden}
                value={credentials.password}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
      <View>
        {/* <IconButton
          onPress={() => deleteRecord(JSON.parse(password[1]))}
          icon="delete"
        /> */}
        <IconButton
          onPress={() => setValueHidden(!isValueHidden)}
          icon={isValueHidden ? 'eye-off' : 'eye'}
        />
      </View>
    </Surface>
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
  search: {
    marginBottom: 10,
  },
  password: {
    marginVertical: 5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 5,
    marginBottom: 5,
  },
});

export default RecordCard;
