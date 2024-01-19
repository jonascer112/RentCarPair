
import React, { useState, useEffect } from 'react';

import { Button, View, Text, FlatList, StyleSheet, StatusBar, Pressable } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RentalScreen from './RentalScreen.js';
import HomeScreen from './HomeScreen.js';
import CancelScreen from './CancelScreen.js';

import styles from './myStyles.js'


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        
        <Stack.Screen
        name="Home"
        component={HomeScreen}
        />

        <Stack.Screen
        name="Rent"
        component={RentalScreen}
        />

<Stack.Screen
        name="Cancel"
        component={CancelScreen}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;