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
    console.log('search');
    // load
    storage
      .load({
        key: 'title',
      })
      .then(ret => {
        // found data goes to then()
        console.log('value', ret.value);
        console.log('key', ret.key);
      })
      .catch(err => {
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
