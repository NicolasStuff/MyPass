import React, {useState, useEffect} from 'react';

import {ScrollView, View, StyleSheet} from 'react-native';
import {Headline, Snackbar} from 'react-native-paper';
import RecordCard from './RecordCard';
import {getAllKeys, multiGet} from '../localStorage';

const AddRecordScreen = () => {
  const [isSnackVisible, setSnackVisible] = useState(false);
  const [snackText, setSnackText] = useState('Done');
  const [passwords, setPasswords] = useState([]);

  useEffect(() => {
    let handleGetKeyAndMultiGet2 = async () => {
      let keysArrValue = await getAllKeys();
      console.log('keysArrValue', keysArrValue);
      if (keysArrValue._W !== null) {
        let ret = await multiGet(keysArrValue);
        // console.log('ret', ret);
        setPasswords(ret);
      }
    };
    handleGetKeyAndMultiGet2();
  }, [setPasswords, passwords]);

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
              passwords={passwords}
              setPasswords={setPasswords}
              setSnackVisible={setSnackVisible}
              setSnackText={setSnackText}
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

export default AddRecordScreen;
