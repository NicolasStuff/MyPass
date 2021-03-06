import React, {useState} from 'react';

import {View, ScrollView, StyleSheet} from 'react-native';
import {
  Headline,
  TextInput,
  HelperText,
  Button,
  IconButton,
  Snackbar,
} from 'react-native-paper';
import {setItem} from '../localStorage';

const AddRecordScreen = ({counter, setCounter}) => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [isValueHidden, setValueHidden] = useState(true);
  const [isSnackVisible, setSnackVisible] = useState(false);
  const [snackText, setSnackText] = useState('');

  const handleValueHidden = () => {
    setValueHidden(!isValueHidden);
  };
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + min;
  };

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
      try {
        await setItem(id.toString(), JSON.stringify(obj));
      } catch (error) {
        console.log('error setItem', error);
      } finally {
        setItem('');
        setTitle('');
        setValue('');
        setCounter(counter + 1);
      }
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
