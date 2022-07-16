// Import React
import React, {Component, useState, useEffect} from 'react';

import { StyleSheet, TouchableOpacity, Text ,View } from "react-native";
import { FontAwesome, Ionicons } from '@expo/vector-icons'; 

// Import Navigators from React Navigation
import {createDrawerNavigator} from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import {connect} from "react-redux";
import {getItems,getLocation,updatedCart,getHomescreenData} from "../actions/itemsAction";

import * as Location from 'expo-location';
// Import Screens
import CustomSidebarMenu from './Components/CustomSidebarMenu';

import HomeScreen from "../activity/DrawerScreens/HomeScreen2";
import CategoryScreen from "./DrawerScreens/CategoryScreen";
import SearchScreen from "./DrawerScreens/SearchScreen";
import RewardsScreen from "./DrawerScreens/RewardsScreen";
import Rewards from "./DrawerScreens/Rewards";
import InstantCartItem from "./DrawerScreens/InstantCartItem";

import CartScreen from "./DrawerScreens/CartScreen";
import AboutUsScreen from "./DrawerScreens/AboutusScreen";
import NotificationsView from "./DrawerScreens/NotificationsView";

import ProfileScreen from "./DrawerScreens/ProfileScreen";
import TermsConditionScreen from "./DrawerScreens/TermsConditionScreen";
import NavigationDrawerHeader from '../activity/Components/NavigationDrawerHeader';
import AsyncStorage from '@react-native-community/async-storage';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();
var customTitle = "Welcome !";
var user_id = "0";


const CartStackNavigator = (props) => {
    return (
      <Stack.Navigator>
          <Stack.Screen
            name="CartScreen"
            component={CartScreen}
            options={{
              title: 'Cart', //Set Header Title
              headerLeft: () =>(
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={24} color="#ffffff" />
            </TouchableOpacity>
              ),
              headerRight: () => ( 
                <TouchableOpacity onPress={() => 
                  {
                    if(user_id=="0")
                    {
                      props.navigation.navigate("Auth");
                    }
                    else
                    {
                      props.navigation.navigate("ProfileScreen")
                    }
                  }
                ///props.navigation.navigate("ProfileScreen")
                }>
                    <FontAwesome style={{padding: 7, marginRight: 10,}} name="user-circle" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              ), //Set Header right icon
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

const RewardsStackNavigator = ({navigation}) => {
    return (
      <Stack.Navigator>
          <Stack.Screen
            name="RewardsScreen"
            component={RewardsScreen}
            options={{
              title: 'Rewards', //Set Header Title
              headerLeft: () =>(
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
            </TouchableOpacity>
              ),
              headerRight: () => ( 
                <TouchableOpacity onPress={() => 
                  {
                    if(user_id=="0")
                    {
                      props.navigation.navigate("Auth");
                    }
                    else
                    {
                      props.navigation.navigate("ProfileScreen")
                    }
                  }
                ///props.navigation.navigate("ProfileScreen")
                }>
                    <FontAwesome style={{padding: 7, marginRight: 10,}} name="user-circle" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              ), //Set Header right icon
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

const RewardStackNavigator = (props) => {
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="Rewards"
          component={Rewards}
          options={{
            title: 'Rewards', //Set Header Title
            headerLeft: () =>(
              <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
          </TouchableOpacity>
            ),
            headerRight: () => ( 
              <TouchableOpacity onPress={() => 
                {
                  if(user_id=="0")
                  {
                    props.navigation.navigate("Auth");
                  }
                  else
                  {
                    props.navigation.navigate("ProfileScreen")
                  }
                }
              ///props.navigation.navigate("ProfileScreen")
              }>
                  <FontAwesome style={{padding: 7, marginRight: 10,}} name="user-circle" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            ), //Set Header right icon
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
const InstantCartItemStackNavigator = (props) => {
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="InstantCartItem"
          component={InstantCartItem}
          options={{
            title: 'Instant Cart', //Set Header Title
            headerLeft: () =>(
              <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
          </TouchableOpacity>
            ),
            headerRight: () => ( 
              <TouchableOpacity onPress={() => 
                {
                  if(user_id=="0")
                  {
                    props.navigation.navigate("Auth");
                  }
                  else
                  {
                    props.navigation.navigate("ProfileScreen")
                  }
                }
              ///props.navigation.navigate("ProfileScreen")
              }>
                  <FontAwesome style={{padding: 7, marginRight: 10,}} name="user-circle" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            ), //Set Header right icon
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

const SearchStackNavigator = (props) => {
    return (
      <Stack.Navigator>
          <Stack.Screen
            name="SearchScreen"
            component={SearchScreen}
            options={{
              title: 'Search', //Set Header Title
              headerLeft: () =>(
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
            </TouchableOpacity>
              ),
              headerRight: () => ( 
                <TouchableOpacity onPress={() => 
                  {
                    if(user_id=="0")
                    {
                      props.navigation.navigate("Auth");
                    }
                    else
                    {
                      props.navigation.navigate("ProfileScreen")
                    }
                  }
                ///props.navigation.navigate("ProfileScreen")
                }>
                    <FontAwesome style={{padding: 7, marginRight: 10,}} name="user-circle" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              ), //Set Header right icon
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

const MainStackNavigator = (props) => {

    return (
      <Stack.Navigator initialRouteName="HomeScreen">
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              title: customTitle, //Set Header Title
              headerLeft: () =>(
                <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
                    <FontAwesome style={{padding: 7, marginLeft: 10,}} name="bars" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              ),
              headerRight: () => ( 
                <TouchableOpacity onPress={() => 
                  {
                    if(user_id=="0")
                    {
                      props.navigation.navigate("Auth");
                    }
                    else
                    {
                      props.navigation.navigate("ProfileScreen")
                    }
                  }
                ///props.navigation.navigate("ProfileScreen")
                }>
                    <FontAwesome style={{padding: 7, marginRight: 10,}} name="user-circle" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              ), //Set Header right icon
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
  
  const CategoryStackNavigator = (props) => {
      return (
        <Stack.Navigator>
            <Stack.Screen
              name="CategoryScreen"
              component={CategoryScreen}
              options={{
                title: 'Category', //Set Header Title
                headerLeft: () =>(
                  <TouchableOpacity onPress={() => props.navigation.goBack()}>
                  <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
              </TouchableOpacity>
                ),
                headerRight: () => ( 
                  <TouchableOpacity onPress={() => 
                    {
                      if(user_id=="0")
                      {
                        props.navigation.navigate("Auth");
                      }
                      else
                      {
                        props.navigation.navigate("ProfileScreen")
                      }
                    }
                  ///props.navigation.navigate("ProfileScreen")
                  }>
                      <FontAwesome style={{padding: 7, marginRight: 10,}} name="user-circle" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                ), //Set Header right icon
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

  const AboutUsStackNavigator = (props) => {
    return (
      <Stack.Navigator>
          <Stack.Screen
            name="AboutUsScreen"
            component={AboutUsScreen}
            options={{
              title: 'About Us', //Set Header Title
              headerLeft: () =>(
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
            </TouchableOpacity>
              ),
              headerRight: () => ( 
                <TouchableOpacity onPress={() => 
                  {
                    if(user_id=="0")
                    {
                      props.navigation.navigate("Auth");
                    }
                    else
                    {
                      props.navigation.navigate("ProfileScreen")
                    }
                  }
                ///props.navigation.navigate("ProfileScreen")
                }>
                    <FontAwesome style={{padding: 7, marginRight: 10,}} name="user-circle" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              ), //Set Header right icon
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
const NotificationStackNavigator = (props) => {
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="Notifications"
          component={NotificationsView}
          options={{
            title: 'Notifications', //Set Header Title
            headerLeft: () =>(
              <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
          </TouchableOpacity>
            ),
            headerRight: () => ( 
              <TouchableOpacity onPress={() => 
                {
                  if(user_id=="0")
                  {
                    props.navigation.navigate("Auth");
                  }
                  else
                  {
                    props.navigation.navigate("ProfileScreen")
                  }
                }
              ///props.navigation.navigate("ProfileScreen")
              }>
                  <FontAwesome style={{padding: 7, marginRight: 10,}} name="user-circle" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            ), //Set Header right icon
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

const ProfileStackNavigator = (props) => {
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{
            title: 'Profile', //Set Header Title
            headerLeft: () =>(
              <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
          </TouchableOpacity>
            ),
            // headerRight: () => ( 
            //   <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
            //       <FontAwesome style={{padding: 7, marginRight: 10,}} name="user-circle" size={24} color="#FFFFFF" />
            //   </TouchableOpacity>
            // ), //Set Header right icon
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

const TermsConditionStackNavigator = (props) => {
  return (
      <Stack.Navigator>
          <Stack.Screen
            name="TermsConditionScreen"
            component={TermsConditionScreen}
            options={{
              title: 'Terms and Conditions', //Set Header Title
              headerLeft: () =>(
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
            </TouchableOpacity>
              ),
              headerRight: () => ( 
                <TouchableOpacity onPress={() => 
                  {
                    if(user_id=="0")
                    {
                      props.navigation.navigate("Auth");
                    }
                    else
                    {
                      props.navigation.navigate("ProfileScreen")
                    }
                  }
                ///props.navigation.navigate("ProfileScreen")
                }>
                    <FontAwesome style={{padding: 7, marginRight: 10,}} name="user-circle" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              ), //Set Header right icon
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
  
const BottomTabNavigator = (props) => {
    return (
      <Tab.Navigator
          barStyle={{ backgroundColor: '#062FFF' }}
          activeColor="#FFFFFF"
          screenOptions={({ route }) => ({
              tabBarIcon: ({ color }) => {
                  if (route.name === 'Home') {
                      return (
                          <FontAwesome name="home" size={20} color={color} />
                      );
                  } else if (route.name === 'Categories') {
                      return (
                          <FontAwesome name="qrcode" size={20} color={color} />
                      );
                  } else if (route.name === 'Search') {
                    return (
                        <Ionicons name="search" size={20} color={color} />
                    );
                  } else if (route.name === 'InstantCartItem') {
                    return (
                        <FontAwesome name="add" size={20} color={color} />
                    );
                  } else if (route.name === 'Cart') {
                    return (
                        <FontAwesome name="shopping-cart" size={20} color={color} />
                    );
                  } 
              },
              headerLeft: () => (
                <NavigationDrawerHeader navigationProps={props} />
              ),
          })}
      >
        <Tab.Screen name="Home" component={MainStackNavigator} />
        <Tab.Screen name="Categories" component={CategoryStackNavigator} />
        <Tab.Screen name="Search" component={SearchStackNavigator} />
        <Tab.Screen name="InstantCartItem" component={InstantCartItemStackNavigator} />
        <Tab.Screen name="Cart" component={CartStackNavigator} />
      </Tab.Navigator>
    );
};
const ProfileStackNavigator1 = ({navigation}) => {
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{
            title: 'Profile', //Set Header Title
            headerLeft: () =>(
              <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
          </TouchableOpacity>
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
const DrawerNavigatorRoutes = (props) => {
  if(props.item.userdata.user_name !== undefined){
    customTitle = `Welcome ${props.item.userdata.first_name} !`;
  }
  else   customTitle = `Welcome !`;

    if(props.item.userdata.user_id)
    {
      user_id = props.item.userdata.user_id
    }
    else
    {
      user_id = "0"
    }
  
  return (
    <Drawer.Navigator
      drawerContentOptions={{
        activeTintColor: '#cee1f2',
        color: '#cee1f2',
        itemStyle: {marginVertical: 5, color: 'white'},
        labelStyle: {
          color: '#d8d8d8',
        },
      }}
      user_name={props.item.userdata.first_name?props.item.userdata.first_name:""}
      screenOptions={{headerShown: false}}
      drawerContent={CustomSidebarMenu}>
      <Drawer.Screen
        name="MainStackNavigator"
        options={{drawerLabel: 'Home'}}
        component={BottomTabNavigator}
      />
      <Drawer.Screen
        name="ProfileStackNavigator"
        options={{drawerLabel: 'My Profile'}}
        component={ProfileStackNavigator}
      />
      <Drawer.Screen
        name="AboutUsStackNavigator"
        options={{drawerLabel: 'About Us'}}
        component={AboutUsStackNavigator}
      />
        <Drawer.Screen
        name="NotificationStackNavigator"
        options={{drawerLabel: 'Notifications'}}
        component={NotificationStackNavigator}
      />
      <Drawer.Screen
        name="TermsConditionStackNavigator"
        options={{drawerLabel: 'Terms & Privacy'}}
        component={TermsConditionStackNavigator}
      />
    </Drawer.Navigator>
  );
};

const mapStateToProps = (state) => {
  // console.log("State Contains:-"+ state)
  // console.log(`Map State to props in Drawer:- ${state.item.homepageData.status}`)
  return({
      //Here State.post is 
      //Coming From -> "./reducers/index.js"
      //where "post" is defined under combineReducers
      item:state.item
  })
}
export default connect(mapStateToProps, {getItems,getLocation,updatedCart,getHomescreenData})(DrawerNavigatorRoutes);
// export default DrawerNavigatorRoutes;

const styles = StyleSheet.create({
    keyIcon:{
      padding: 7,
      marginRight: 10,
    },
    skipText:{
      color:"white",
      fontWeight:"bold",
      alignItems: "flex-end",
      // marginTop: 30,
      marginLeft: 10,
      fontSize: 20,
    },
    skip:{
      alignItems: "flex-start",
    },
});