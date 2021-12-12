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
import {getAllKeys, multiGet, removeItem} from '../localStorage';

const RecordCard = ({
  password,
  setSnackVisible,
  passwords,
  setPasswords,
  records,
  setSnackText,
}) => {
  const [isValueHidden, setValueHidden] = useState(true);
  const [cartDataRefactor, setCartDataRefactor] = useState(
    JSON.parse(password[1]),
  );
  console.log(password);
  useEffect(() => {
    let handleGetKeyAndMultiGet = async () => {
      let keysArrValue = await getAllKeys();
      console.log('keysArrValue', keysArrValue);
      if (keysArrValue._W !== null) {
        let ret = await multiGet(keysArrValue);
        // console.log('ret', ret);
        setPasswords(ret);
      }
    };
    handleGetKeyAndMultiGet();
  }, [setPasswords]);

  const deleteRecord = async del => {
    await removeItem(del.id.toString());

    let handleGetKeyAndMultiGet = async () => {
      let keysArrValue = await getAllKeys();
      console.log('keysArrValue', keysArrValue);
      if (keysArrValue._W !== null) {
        let ret = await multiGet(keysArrValue);
        // console.log('ret', ret);
        setPasswords(ret);
      }
      setSnackText('Record Deleted');
      setSnackVisible(true);
    };
    handleGetKeyAndMultiGet();
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
          onPress={() => copyToClipboard(cartDataRefactor.title, 'Key')}>
          <Title>{cartDataRefactor.title}</Title>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => copyToClipboard(cartDataRefactor.value, 'Value')}>
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
            value={cartDataRefactor.value}
          />
        </TouchableOpacity>
        <Caption style={{marginTop: 10}}>{cartDataRefactor.time}</Caption>
      </View>
      <View>
        <IconButton
          onPress={() => deleteRecord(cartDataRefactor)}
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
