import React from 'react';
import 'react-native-gesture-handler';
import { View, StatusBar } from 'react-native';

const App: React.FC = () => (
  <View style={{ backgroundColor: '#1F252A', flex: 1 }}>
    <StatusBar barStyle="light-content" backgroundColor="#1F252A" />
  </View>
);

export default App;
