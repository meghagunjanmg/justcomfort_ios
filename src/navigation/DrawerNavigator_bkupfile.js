import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import { SplashStackNavigator, ForgetPassStackNavigator, SignUpStackNavigator, SignInStackNavigator, CategoryStackNavigator, SearchStackNavigator, RewardsStackNavigator, CartStackNavigator } from "./StackNavigator";
import TabNavigator from "./TabNavigator";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="SignIn" component={SignInStackNavigator} />
      <Drawer.Screen name="ForgetPass" component={ForgetPassStackNavigator} />
      <Drawer.Screen name="SignUp" component={SignUpStackNavigator} />
      <Drawer.Screen name="Home" component={TabNavigator} />
      <Drawer.Screen name="Category" component={CategoryStackNavigator} />
      <Drawer.Screen name="Search" component={SearchStackNavigator} />
      <Drawer.Screen name="Rewards" component={RewardsStackNavigator} />
      <Drawer.Screen name="Cart" component={CartStackNavigator} />
      <Drawer.Screen name="Splash" component={SplashStackNavigator} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;