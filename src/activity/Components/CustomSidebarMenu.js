// Import React and Component
import React, { useState } from 'react';
import {View, Text, Alert, StyleSheet, Image , TouchableOpacity, TextInput} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import { AntDesign} from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 

import AsyncStorage from '@react-native-community/async-storage';
import {connect} from "react-redux";
import {getItems,getLocation,updatedCart,getHomescreenData} from "../../actions/itemsAction";

const CustomSidebarMenu = (props) => {
  // console.log("props in Custom sidebar menu is :-"+props)
  // var [username,changeUserName] = useState(props.user_name);
  return (
    <View style={stylesSidebar.sideMenuContainer}>
      <View style={stylesSidebar.profileHeader}>
        <View style={stylesSidebar.profileHeaderPicCircle}>
          <Image
            source={require('../../../assets/ic_launcher.png')}
            style={stylesSidebar.image}
          />
        </View>
        <Text style={stylesSidebar.profileHeaderText}>
          just comfort 
        </Text>
        <AntDesign style={{right: 0, top: 20, left: 60,}} name="right" size={20} color="#FFFFFF" />
      </View>
      <View style={stylesSidebar.profileMenuBar} >
          <TouchableOpacity style={stylesSidebar.profileMenuBarStyle} onPress={() => props.navigation.navigate("OrderScreen")}>
            <Entypo name="menu" size={20} color="white" />
            <Text style={{color: '#ffffff', alignItems: 'center', textAlign: 'center'}}>
              My Orders
            </Text>
            </TouchableOpacity>
          <TouchableOpacity style={stylesSidebar.profileMenuBarStyle} onPress={() => props.navigation.navigate("RewardsScreen")}>
            <AntDesign name="gift" size={20} color="white" />
            <Text style={{color: '#ffffff'}}>
              Rewards
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={stylesSidebar.profileMenuBarStyle}  onPress={() => props.navigation.navigate("WalletScreen")}>
            <AntDesign name="wallet" size={20} color="white" />
            <Text style={{color: '#ffffff'}}>
              Wallet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={stylesSidebar.profileMenuBarStyle} onPress={() => props.navigation.push("CartScreen")}>
            <AntDesign name="shoppingcart" size={20} color="white" />
            <Text style={{color: '#ffffff'}}>
              Cart
            </Text>
          </TouchableOpacity>       
      </View>

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {/* <DrawerItem
          label={({color}) =>
          <Text style={{color: '#d8d8d8'}}>
            Login/Logout
          </Text> 
          
            
          }
          onPress={() => {
            props.navigation.toggleDrawer();
            Alert.alert(
              'Login/Logout',
              'Are you sure?',
              [
                {
                  text: 'Cancel',
                  onPress: () => {
                    return null;
                  },
                },
                {
                  text: 'Confirm',
                  onPress: async() => {
                    await AsyncStorage.clear();
                    props.navigation.replace('Auth');
                  },
                },
              ],
              {cancelable: false},
            );
          }}
        /> */}
      </DrawerContentScrollView>
    </View>
  );
};
export default CustomSidebarMenu;

const stylesSidebar = StyleSheet.create({
    sideMenuContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: '#2C2A2A',
      paddingTop: 40,
      color: 'white',
    },
    profileHeader: {
      flexDirection: 'row',
      backgroundColor: '#2C2A2A',
      padding: 15,
      textAlign: 'center',
    },
    profileHeaderPicCircle: {
      width: 60,
      height: 60,
      borderRadius: 60 / 2,
      color: 'white',
      backgroundColor: '#ffffff',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileHeaderText: {
      color: 'white',
      alignSelf: 'center',
      paddingHorizontal: 10,
      fontWeight: 'bold',
    },
    profileHeaderLine: {
      height: 1,
      marginHorizontal: 20,
      backgroundColor: '#e2e2e2',
      marginTop: 15,
    },
    profileMenuBar: {
      flexDirection: 'row',
      height: 70,
      //marginHorizontal: 20,
      backgroundColor: '#062FFF',
      marginTop: 15,
      justifyContent: 'space-between',
      padding: 10,
    },
    profileMenuBarStyle: {
      alignItems: 'center',
      width: 60,
    },
    image :{
      width: 50,
      height:50,
      margin: 10,
      alignItems: "center"
    },
  });