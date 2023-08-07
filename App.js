// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddTripScreen from './screens/AddTripScreen';
import ViewTripScreen from './screens/ViewTripScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddTrip" component={AddTripScreen} />
        <Stack.Screen name="ViewTrip" component={ViewTripScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
