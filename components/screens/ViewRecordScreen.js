import React, {useState, useEffect, useCallback} from 'react';

import {ScrollView, View, StyleSheet, Text} from 'react-native';
import {Button, Headline, Snackbar} from 'react-native-paper';
import RecordCard from './RecordCard';
import {getAllKeys, multiGet, removeItem} from '../localStorage';
import {getAll, load, reset} from '../localStorage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';

const ViewRecordScreen = ({counter, setCounter}) => {
  const [isSnackVisible, setSnackVisible] = useState(false);
  const [snackText, setSnackText] = useState('Done');
  const [passwords, setPasswords] = useState([]);
  const [removedItem, setRemovedItem] = useState(null);

  const [credentials, setCredentials] = useState([]);
  // console.log('credentials', credentials);
  const [keysProvider, setKeysProvider] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let handleGetKeys = async () => {
        getAll().then(data => {
          console.log('data', data);
          setKeysProvider(data);
        });
      };
      handleGetKeys();

      return () => handleGetKeys();
    }, [setKeysProvider]),
  );

  const onload = async name => {
    let ret = await load(name);
    console.log('ret', ret);
  };

  useEffect(() => {
    let handleGetKeyAndMultiGet = async () => {
      let keysArrValue;
      try {
        keysArrValue = await getAllKeys();
      } catch (e) {
        console.log('error', e);
      } finally {
        keysArrValue = await getAllKeys();
        if (keysArrValue._W !== null) {
          let ret = await multiGet(keysArrValue);
          // console.log('ret', ret);
          setPasswords(ret);
        }
      }
    };
    handleGetKeyAndMultiGet();
  }, [setPasswords, removedItem, counter]);

  if (removedItem !== null) {
    console.log('removedItem', removedItem);
    const deleteRecord = async () => {
      let keysArrValue;
      try {
        return await removeItem(removedItem.id.toString());
      } catch (e) {
        console.log('error', e);
      } finally {
        let handleGetKeyAndMultiGet = async () => {
          try {
            keysArrValue = await getAllKeys();
          } catch (e) {
            console.log('error', e);
          } finally {
            // console.log('keysArrValue', keysArrValue);
            if (keysArrValue._W !== null) {
              let ret = await multiGet(keysArrValue);
              console.log('ret', ret);
              setPasswords(ret);
              setRemovedItem(null);
            }
            setSnackText('Record Deleted');
            setSnackVisible(true);
          }
        };
        handleGetKeyAndMultiGet();
      }
    };
    deleteRecord();
  }

  return (
    <>
      <View style={styles.wrapper}>
        <View>
          <Headline style={styles.title}>Added Records</Headline>
          <TouchableOpacity
            style={styles.title}
            onPress={() => {
              onload('Apple');
            }}>
            <Text>Load Credentials</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {keysProvider.map((keyProvider, index) => (
            <RecordCard
              key={index}
              provider={keyProvider}
              password={passwords}
              setPasswords={setPasswords}
              setSnackVisible={setSnackVisible}
              setSnackText={setSnackText}
              setRemovedItem={setRemovedItem}
            />
          ))}
        </ScrollView>
      </View>
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

export default ViewRecordScreen;
