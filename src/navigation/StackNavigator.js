import React from "react";

import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome } from '@expo/vector-icons'; 

import HomeScreen from "../activity/DrawerScreens/HomeScreen";
import SettingsScreen from "../activity/DrawerScreens/SettingsScreen";
import NavigationDrawerHeader from '../activity/Components/NavigationDrawerHeader';

const Stack = createStackNavigator();

const screenOptionStyle = {
    headerStyle: {
      backgroundColor: "tomato",
    },
    headerTintColor: "white",
    headerBackTitle: "Back",
  };

const MainStackNavigator = (navigation) => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            title: 'Welcome!', //Set Header Title
            headerRight: () => ( 
                  <FontAwesome style={styles.keyIcon} name="user-circle" size={24} color="#2C2A2A" />
              ), //Set Header right icon
            headerLeft: () => (
              <NavigationDrawerHeader navigationProps={navigation} />
            ),
            headerStyle: {
              backgroundColor: '#062FFF', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'normal', //Set Header text style
            },
          }}
        />
      </Stack.Navigator>
  );
}

const SettingsStackNavigator = (navigation) => {
    return (
      <Stack.Navigator initialRouteName="SettingsScreen"
          screenOptions={{
            headerLeft: () => (
              <NavigationDrawerHeader navigationProps={navigation} />
            ),
            headerRight: () => ( 
                <FontAwesome style={styles.keyIcon} name="user-circle" size={24} color="#2C2A2A" />
            ), //Set Header right icon
            headerStyle: {
              backgroundColor: '#062FFF', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'normal', //Set Header text style
            },
          }}>
          <Stack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{
              title: 'Settings', //Set Header Title
            }}
          />
       </Stack.Navigator>
    );
}


export { MainStackNavigator, SettingsStackNavigator };

const styles = StyleSheet.create({
  keyIcon:{
    padding: 7,
    marginRight: 10,
  },
});