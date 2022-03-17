import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import HomeTabs from './components/HomeTabs';
import KeychainEx from './components/KeychainFunctionalComponent';

const App = () => {
  return (
    <NavigationContainer>
      <HomeTabs />
    </NavigationContainer>
  );
};

export default App;
