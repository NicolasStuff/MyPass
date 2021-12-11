/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';

import {View, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {
  Surface,
  TextInput,
  Title,
  Caption,
  IconButton,
} from 'react-native-paper';
import Clipboard from '@react-native-community/clipboard';
import {set} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecordCard = ({
  record,
  setSnackVisible,
  password,
  setPassword,
  records,
  setSnackText,
  setDeleted,
  isDeleted,
}) => {
  const [isValueHidden, setValueHidden] = useState(true);
  const [cartDataRefactor, setCartDataRefactor] = useState(
    JSON.parse(record[1]),
  );
  // console.log('cartDataRefactor', cartDataRefactor.id);

  const deleteRecord = async del => {
    // console.log('del', del);

    // console.log('deleteRecord', del);
    try {
      await AsyncStorage.removeItem(del.id.toString());
      let keys = [];
      let handleGetKeyAndMultiGet = async () => {
        // console.log('je redemande les clefs pour mettre à jour');
        try {
          keys = await AsyncStorage.getAllKeys();
        } catch (e) {
          console.log(e);
        } finally {
          if (keys._W !== null) {
            await AsyncStorage.multiGet(keys).then(response => {
              setPassword(response);
              setDeleted(false);
            });
          }
        }
      };
      // setRecords(
      //   cartDataRefactor.filter(recordss => recordss[0].id !== del.id),
      // );
      setDeleted(!isDeleted);
      setSnackText('Record Deleted');
      setSnackVisible(true);
    } catch (e) {
      console.log(e);
      // remove error
    }
  };

  const copyToClipboard = (text, type) => {
    Clipboard.setString(text);
    setSnackText(`Copied ${type} to Clipboard`);
    setSnackVisible(true);
  };

  return (
    <Surface style={styles.record}>
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
  record: {
    marginVertical: 5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default RecordCard;
