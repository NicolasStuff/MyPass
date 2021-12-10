import React, {useState, useEffect} from 'react';

import {ScrollView, View, StyleSheet} from 'react-native';
import {Headline, Searchbar, Snackbar} from 'react-native-paper';
import RecordCard from './RecordCard';
import storage from './storage';

const AddRecordScreen = ({records, setRecords}) => {
  const [search, setSearch] = useState('');
  const [display, setDisplay] = useState([]);
  const [isSnackVisible, setSnackVisible] = useState(false);
  const [snackText, setSnackText] = useState('Done');

  const handleSearch = text => {
    setSearch(text);
  };

  useEffect(() => {
    storage
      .load({
        key: 'records',

        // autoSync (default: true) means if data is not found or has expired,
        // then invoke the corresponding sync method
        autoSync: true,

        // syncInBackground (default: true) means if data expired,
        // return the outdated data first while invoking the sync method.
        // If syncInBackground is set to false, and there is expired data,
        // it will wait for the new data and return only after the sync completed.
        // (This, of course, is slower)
        syncInBackground: true,

        // you can pass extra params to the sync method
        // see sync example below
        syncParams: {
          extraFetchOptions: {
            // blahblah
          },
          someFlag: true,
        },
      })
      .then(ret => {
        // found data go to then()
		console.log('ret', ret);
        const results = ret.filter(record =>
          record.title.toLowerCase().includes(search.toLowerCase()),
        );
        setDisplay(results);
      })
      .catch(err => {
        // any exception including data not found
        // goes to catch()
        console.warn(err.message);
        switch (err.name) {
          case 'NotFoundError':
            // TODO;
            break;
          case 'ExpiredError':
            // TODO
            break;
        }
      });
    // const results = records.filter(record =>
    //   record.title.toLowerCase().includes(search.toLowerCase()),
    // );
    // console.log('results', results);
    // setDisplay(results);
  }, [search, records]);

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
          {display.map((record, index) => (
            <RecordCard
              key={index}
              record={record}
              records={records}
              setRecords={setRecords}
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
