import React, {useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import AddRecordScreen from './screens/AddRecordScreen';
import ViewRecordScreen from './screens/ViewRecordScreen';

const Tab = createMaterialTopTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Add Record">{() => <AddRecordScreen />}</Tab.Screen>
      <Tab.Screen name="View Record">{() => <ViewRecordScreen />}</Tab.Screen>
    </Tab.Navigator>
  );
};

export default HomeTabs;
