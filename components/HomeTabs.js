import React, {useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import AddRecordScreen from './screens/AddRecordScreen';
import ViewRecordScreen from './screens/ViewRecordScreen';

const Tab = createMaterialTopTabNavigator();

const HomeTabs = () => {
  const [counter, setCounter] = useState([]);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Add Record">
        {() => <AddRecordScreen counter={counter} setCounter={setCounter}/>}
      </Tab.Screen>
      <Tab.Screen name="View Record">
        {() => <ViewRecordScreen counter={counter} setCounter={setCounter}/>}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default HomeTabs;
