import React, {useState, useEffect} from 'react';

import {ScrollView, View, StyleSheet} from 'react-native';
import {Headline, Snackbar} from 'react-native-paper';
import RecordCard from './RecordCard';
import {getAllKeys, multiGet, removeItem} from '../localStorage';

const ViewRecordScreen = ({counter, setCounter}) => {
  const [isSnackVisible, setSnackVisible] = useState(false);
  const [snackText, setSnackText] = useState('Done');
  const [passwords, setPasswords] = useState([]);
  const [removedItem, setRemovedItem] = useState(null);
  console.log('passwords', passwords);

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
          console.log('ret', ret);
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
        </View>
        <ScrollView>
          {passwords.map((password, index) => (
            <RecordCard
              key={index}
              password={password}
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
