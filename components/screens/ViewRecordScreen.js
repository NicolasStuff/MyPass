import React, {useState, useEffect} from 'react';

import {ScrollView, View, StyleSheet} from 'react-native';
import {Headline, Searchbar, Snackbar} from 'react-native-paper';
import RecordCard from './RecordCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAllKeys, multiGet} from '../localStorage';

const AddRecordScreen = () => {
  const [search, setSearch] = useState('');
  const [display, setDisplay] = useState([]);
  const [isSnackVisible, setSnackVisible] = useState(false);
  const [snackText, setSnackText] = useState('Done');
  const [password, setPassword] = useState([]);
  const [isDeleted, setDeleted] = useState(false);

  // console.log('isDeleted', isDeleted);

  const handleSearch = text => {
    setSearch(text);
  };

  useEffect(() => {
    const handleFilter = ret => {
      let filteredArray = ret.filter(record =>
        JSON.parse(record[1].includes(search.toLowerCase())),
      );
      setDisplay(filteredArray);
    };

    let handleGetKeyAndMultiGet2 = async () => {
      let keysArrValue = await getAllKeys();
      console.log('keysArrValue', keysArrValue);
      if (keysArrValue._W !== null) {
        let ret = await multiGet(keysArrValue);
        console.log('ret', ret);
        handleFilter(ret);
        setPassword(ret);
      }
    };

    handleGetKeyAndMultiGet2();
  }, [search, isDeleted]);

  return (
    <>
      <View style={styles.wrapper}>
        <View>
          <Headline style={styles.title}>Added Records</Headline>
          <Searchbar
            style={styles.search}
            placeholder="Search"
            value={search}
            onChangeText={text => handleSearch(text)}
          />
        </View>
        <ScrollView>
          {password.map((record, index) => (
            <RecordCard
              key={index}
              record={record}
              password={password}
              setPassword={setPassword}
              setSnackVisible={setSnackVisible}
              setSnackText={setSnackText}
              setDeleted={setDeleted}
              isDeleted={isDeleted}
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
