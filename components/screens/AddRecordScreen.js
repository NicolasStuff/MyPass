import React, {useEffect, useState} from 'react';

import {View, ScrollView, KeyboardAvoidingView, StyleSheet} from 'react-native';
import {
  Headline,
  TextInput,
  HelperText,
  Button,
  IconButton,
  Snackbar,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddRecordScreen = ({records, setRecords}) => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [isValueHidden, setValueHidden] = useState(true);
  const [isSnackVisible, setSnackVisible] = useState(false);
  const [snackText, setSnackText] = useState('');

  const [tempValue, setTempValue] = useState([]);
  // console.log('tempValue', tempValue);

  const handleValueHidden = () => {
    setValueHidden(!isValueHidden);
  };
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + min;
  };

  useEffect(() => {}, []);

  const handleAddRecord = async () => {
    if (title.length > 0 && value.length > 0) {
      const id = new Date().getTime() + getRandomInt(10000, 100000);
      const time = new Date().toLocaleDateString();

      let obj = {
        id,
        title,
        value,
        time,
      };
      await AsyncStorage.setItem(id.toString(), JSON.stringify(obj));

      // //SET ITEM
      // try {
      //   const jsonValue = JSON.stringify([id, title]);
      //   await AsyncStorage.setItem(title, jsonValue);
      // } catch (e) {
      //   // save error
      // }

      //GET ALL KEYS
      let keys = [];
      try {
        keys = await AsyncStorage.getAllKeys();
        console.log('keys', keys);
      } catch (e) {
        // read key error
      }

      let passwordData;
      try {
        passwordData = await AsyncStorage.multiGet(keys).then(response => {
          console.log(response[0][0]); // Key1
          console.log(JSON.parse(response[0][1]).title); // Value1
          console.log(typeof response[0][1]); // Value1
          console.log(response[1][0]); // Key2
          console.log(response[1][1]); // Value2
        });
      } catch (e) {
        console.log('error', e);
        // read key error
      }

      // try {
      //   let user = await AsyncStorage.multiGet(keys);
      //   let parsed = JSON.parse(user);
      //   console.log('parsed', parsed);
      //   alert(parsed.title);
      // } catch (error) {
      //   alert(error);
      // }

      // //GET MULTIGET
      // let values;
      // try {
      //   values = await AsyncStorage.multiGet(keys);
      //   console.log('values', values);
      //   return values;
      // } catch (e) {
      //   // read error
      // }

      //GET ITEM (UNIQUE KEY)
      // try {
      //   const jsonValue = await AsyncStorage.getItem(title);
      //   jsonValue != null ? JSON.parse(jsonValue) : null;
      //   console.log('jsonValue', jsonValue);
      //   return jsonValue;
      // } catch (e) {
      //   // read error
      // }

      setRecords([...title, {title, value, time}]);
      setValue('');
      setSnackText('New record added');
      setSnackVisible(true);
    } else {
      setSnackText('Invalid Key/Value');
      setSnackVisible(true);
    }
  };

  return (
    <>
      <ScrollView style={styles.wrapper}>
        <Headline style={styles.title}>Add new record</Headline>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            label="Title"
            value={title}
            onChangeText={text => setTitle(text)}
          />
          <HelperText>Username, Email, etc.</HelperText>
          <View style={styles.valueWrapper}>
            <TextInput
              style={styles.input}
              label="Value"
              value={value}
              onChangeText={text => setValue(text)}
              secureTextEntry={isValueHidden}
            />
            <HelperText>Password, Some secret, etc.</HelperText>
            <View style={styles.viewButton}>
              <IconButton
                icon={isValueHidden ? 'eye' : 'eye-off'}
                onPress={handleValueHidden}
              />
            </View>
          </View>
        </View>
        <Button
          style={styles.addButton}
          mode="contained"
          onPress={handleAddRecord}>
          Add
        </Button>
      </ScrollView>
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
  inputWrapper: {
    marginBottom: 20,
  },
  input: {
    marginTop: 15,
  },
  valueWrapper: {
    position: 'relative',
  },
  viewButton: {
    position: 'absolute',
    right: 10,
    top: 26,
    zIndex: 9,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  addButton: {
    marginBottom: 20,
  },
});

export default AddRecordScreen;
