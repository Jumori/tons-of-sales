import React from 'react';
import 'react-native-gesture-handler';
import { View, StatusBar } from 'react-native';

import Routes from './routes';
import AppContainer from './hooks';

const App: React.FC = () => (
  <View style={{ backgroundColor: '#1F252A', flex: 1 }}>
    <AppContainer>
      <StatusBar barStyle="light-content" backgroundColor="#1F252A" />
      <Routes />
    </AppContainer>
  </View>
);

export default App;
