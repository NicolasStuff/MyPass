import React, {useState, useEffect, useCallback} from 'react';

import {ScrollView, View, StyleSheet, Text} from 'react-native';
import {Button, Headline, Snackbar} from 'react-native-paper';
import RecordCard from './RecordCard';
import {getAll, load, reset} from '../localStorage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';

const ViewRecordScreen = () => {
  const [isSnackVisible, setSnackVisible] = useState(false);
  const [snackText, setSnackText] = useState('Done');

  const [keysProvider, setKeysProvider] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let handleGetKeys = async () => {
        getAll().then(data => {
          console.log('data useFocusEffect', data);
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

export default ViewRecordScreen;
