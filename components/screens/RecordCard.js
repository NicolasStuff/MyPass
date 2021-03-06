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
import {getAllKeys, multiGet} from '../localStorage';

const RecordCard = ({
  password,
  setSnackVisible,
  setPasswords,
  setSnackText,
  setRemovedItem,
}) => {
  const [isValueHidden, setValueHidden] = useState(true);
  console.log('password solo recordCard', password);
  useEffect(() => {
    let handleGetKeyAndMultiGet = async () => {
      let keysArrValue = await getAllKeys();
      if (keysArrValue._W !== null) {
        let ret = await multiGet(keysArrValue);
        setPasswords(ret);
      }
    };
    handleGetKeyAndMultiGet();
  }, [setPasswords]);

  const deleteRecord = async del => {
    try {
      setRemovedItem(del);
    } catch (e) {
      console.log('error', e);
    }
  };

  const copyToClipboard = (text, type) => {
    Clipboard.setString(text);
    setSnackText(`Copied ${type} to Clipboard`);
    setSnackVisible(true);
  };

  return (
    <Surface style={styles.password}>
      <View style={{maxWidth: Dimensions.get('screen').width / 1.3}}>
        <TouchableOpacity
          onPress={() => copyToClipboard(JSON.parse(password[1]).title, 'Key')}>
          <Title>{JSON.parse(password[1]).title}</Title>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            copyToClipboard(JSON.parse(password[1]).value, 'Value')
          }>
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
            value={JSON.parse(password[1]).value}
          />
        </TouchableOpacity>
        <Caption style={{marginTop: 10}}>
          {JSON.parse(password[1]).time}
        </Caption>
      </View>
      <View>
        <IconButton
          onPress={() => deleteRecord(JSON.parse(password[1]))}
          icon="delete"
        />
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
