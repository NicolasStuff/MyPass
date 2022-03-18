/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {
  Surface,
  TextInput,
  Title,
  Caption,
  IconButton,
} from 'react-native-paper';
import Clipboard from '@react-native-community/clipboard';
import {load} from '../localStorage';

const RecordCard = ({
  provider,
  // password,
  // setPasswords,
  // setRemovedItem,
  setSnackVisible,
  setSnackText,
}) => {
  const [isValueHidden, setValueHidden] = useState(true);
  const [credentials, setCredentials] = useState(null);

  // console.log('password solo recordCard', password);

  // useEffect(() => {
  //   let handleGetKeyAndMultiGet = async () => {
  //     let keysArrValue = await getAllKeys();
  //     if (keysArrValue._W !== null) {
  //       let ret = await multiGet(keysArrValue);
  //       setPasswords(ret);
  //     }
  //   };
  //   handleGetKeyAndMultiGet();
  // }, [setPasswords]);

  // const deleteRecord = async del => {
  //   try {
  //     setRemovedItem(del);
  //   } catch (e) {
  //     console.log('error', e);
  //   }
  // };

  const onload = async name => {
    let ret = await load(name);
    console.log('ret', ret);
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
        <TouchableOpacity onPress={() => copyToClipboard('Key')}>
          <Title>Provider : {provider}</Title>
        </TouchableOpacity>
        {credentials === null && (
          <>
            <TouchableOpacity onPress={() => copyToClipboard('Value')}>
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

        {credentials !== null && (
          <>
            <TouchableOpacity onPress={() => copyToClipboard('Value')}>
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
                value={'Username : ' + credentials.username}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => copyToClipboard('Value')}>
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
                value={'password : ' + credentials.password}
              />
            </TouchableOpacity>
          </>
        )}
        {/* <Caption style={{marginTop: 10}}>coucou</Caption> */}
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
});

export default RecordCard;
