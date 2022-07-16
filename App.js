
import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { Alert } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; 
import PushNotificationIOS from "react-native-push-notification";
import PushNotification from "react-native-push-notification";
import Firebase from '@react-native-firebase/app'
import messaging from '@react-native-firebase/messaging';

import LoginScreen from "./src/activity/PhoneVerification";
import RegisterScreen from "./src/activity/Signup";
import SplashScreen from "./src/activity/Splash";
import ProductsScreen from "./src/activity/Components/Products"
import ProfileScreen from "./src/activity/DrawerScreens/ProfileScreen";
import OrderScreen from "./src/activity/Components/OrderScreen";
import WalletScreen from "./src/activity/Components/WalletScreen";
import CartScreen from "./src/activity/DrawerScreens/CartScreen";
import CheckOutScreen from "./src/activity/Components/CartCheckoutScreens/CheckOutScreen.js";
import AddressScreen from "./src/activity/Components/CartCheckoutScreens/AddressScreen.js";
import AddAddressScreen from "./src/activity/Components/CartCheckoutScreens/AddAddressScreen";
import PaymentOptions from "./src/activity/Components/CartCheckoutScreens/PaymentOptions";
import RewardsScreen from "./src/activity/DrawerScreens/Rewards";
import InstantCartItem from "./src/activity/DrawerScreens/InstantCartItem";

import ForgetPass from "./src/activity/ForgetPass.js";
import HomeScreen from './src/activity/DrawerScreens/HomeScreen2';
import SearchScreen from "./src/activity/DrawerScreens/SearchScreen";
import AddtoCartPage from "./src/activity/Components/AddtoCartPage"
import OrderDetailsScreen from "./src/activity/Components/OrderDetailsScreen.js"
import OrderCancelPageScreen from "./src/activity/Components/OrderCancelPage.js";
import DrawerNavigationRoutes from './src/activity/DrawerNavigatorRoutes';
import MapComponent from './src/activity/MapComponent';

import PromocodeScreen from './src/activity/Components/PromocodeScreen';
import { TouchableOpacity } from 'react-native';
import { Provider } from 'react-redux';
import store from "./src/store";
import {_storeData, _retrieveData} from "./src/activity/Storage";
import DemoScreen from './src/activity/Components/DemoScreen';
//To Remove the yellow warnings
import { LogBox } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { colorsDark } from 'react-native-elements/dist/config';
LogBox.ignoreLogs(['Remote debugger']);
LogBox.ignoreLogs(["Warning: Each", "Warning: Failed"]);
// console.ignoredYellowBox = ["Warning: Each", "Warning: Failed"];
LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

const CartStackNavigator = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="CartScreen">
        <Stack.Screen
          name="CartScreen"
          component={CartScreen}
          options={{
            title: 'Cart', //Set Header Title
            headerRight: () => ( 
              <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
                  <FontAwesome style={{padding: 7, marginRight: 10,}} name="user-circle" size={24} color="#2C2A2A" />
              </TouchableOpacity>
            ), //Set Header right icon
              headerLeft: () =>(
                <TouchableOpacity onPress={() => navigation.goBack()}>
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
const CheckOutScreenStackNavigator = ({navigation}) => {
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="CheckOutScreen"
          component={CheckOutScreen}
          options={{
            title: 'CheckOut', //Set Header Title
            headerStyle: {
              backgroundColor: '#062FFF', //Set Header color
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
          </TouchableOpacity>
            ),
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'normal', //Set Header text style
            },
          }}
        />
      </Stack.Navigator>
  );
}
const WalletStackNavigator = ({navigation}) => {
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="WalletScreen"
          component={WalletScreen}
          options={{
            title: 'My Wallet', //Set Header Title
            headerStyle: {
              backgroundColor: '#062FFF', //Set Header color
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
          </TouchableOpacity>
            ),
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'normal', //Set Header text style
            },
          }}
        />
      </Stack.Navigator>
  );
}

const OrderStackNavigator = ({navigation}) => {
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="OrderScreen"
          component={OrderScreen}
          options={{
            title: 'My Orders', //Set Header Title
            headerStyle: {
              backgroundColor: '#062FFF', //Set Header color
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
          </TouchableOpacity>
            ),
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'normal', //Set Header text style
            },
          }}
        />
      </Stack.Navigator>
  );
}
const RewardsScreenStackNavigator = ({navigation}) => {
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="RewardsScreen"
          component={RewardsScreen}
          options={{
            title: 'My Rewards', //Set Header Title
            headerStyle: {
              backgroundColor: '#062FFF', //Set Header color
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
          </TouchableOpacity>
            ),
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'normal', //Set Header text style
            },
          }}
        />
      </Stack.Navigator>
  );
}

const InstantCartItemScreenStackNavigator = ({navigation}) => {
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="InstantCartItem"
          component={InstantCartItem}
          options={{
            title: 'Instant Cart', //Set Header Title
            headerStyle: {
              backgroundColor: '#062FFF', //Set Header color
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
          </TouchableOpacity>
            ),
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'normal', //Set Header text style
            },
          }}
        />
      </Stack.Navigator>
  );
}

const OrderCancelPageStackNavigator = ({navigation}) => {
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="OrderCancelPageScreen"
          component={OrderCancelPageScreen}
          options={{
            title: 'Cancel Orders', //Set Header Title
            headerStyle: {
              backgroundColor: '#062FFF', //Set Header color
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
          </TouchableOpacity>
            ),
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'normal', //Set Header text style
            },
          }}
        />
      </Stack.Navigator>
  );
}
const AddressScreenStackNavigator = ({navigation}) => {
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="AddressScreen"
          component={AddressScreen}
          options={{
            title: 'Saved Address', //Set Header Title
            headerStyle: {
              backgroundColor: '#062FFF', //Set Header color
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
          </TouchableOpacity>
            ),
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'normal', //Set Header text style
            },
          }}
        />
      </Stack.Navigator>
  );
}
const MapComponentStackNavigator = ({navigation}) => {
    return (
    <Stack.Navigator>
        <Stack.Screen
          name="MapComponent"
          component={MapComponent}
          options={{
            title: 'Map', //Set Header Title
            headerStyle: {
              backgroundColor: '#062FFF', //Set Header color
            }, headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
          </TouchableOpacity>
            ),

            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'normal', //Set Header text style
            },
          }}
        />
      </Stack.Navigator>
  );
}
const ProfileStackNavigator = ({navigation}) => {
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{
            title: 'Profile', //Set Header Title
            headerStyle: {
              backgroundColor: '#062FFF', //Set Header color
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
          </TouchableOpacity>
            ),
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'normal', //Set Header text style
            },
          }}
        />
      </Stack.Navigator>
  );
}
const PaymentOptionsStackNavigator = ({navigation}) => {
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="PaymentOptions"
          component={PaymentOptions}
          options={{
            title: 'Payment Options', //Set Header Title
            headerStyle: {
              backgroundColor: '#062FFF', //Set Header color
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
          </TouchableOpacity>
            ),
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'normal', //Set Header text style
            },
          }}
        />
      </Stack.Navigator>
  );
}
const DemoScreenStackNavigator = ({navigation}) => {
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="DemoScreen"
          component={DemoScreen}
          options={{headerShown:false}}
        />
      </Stack.Navigator>
  );
}

const ProductsStackNavigator = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="ProductsScreen">
        <Stack.Screen
          name="ProductsScreen"
          component={ProductsScreen}
          options={{
            title: 'Products', //Set Header Title
            headerRight: () => ( 
              <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
                <FontAwesome style={{padding: 7, marginRight: 10,}} name="user-circle" size={24} color="#2C2A2A" />
              </TouchableOpacity>
            ), //Set Header right icon
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.goBack()}>
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
const PromocodeScreenStackNavigator = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="PromocodeScreen">
        <Stack.Screen
          name="PromocodeScreen"
          component={PromocodeScreen}
          options={{
            title: 'Coupons', //Set Header Title
            headerStyle: {
              backgroundColor: '#062FFF', //Set Header color
            },
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
          </TouchableOpacity>
            ),
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'normal', //Set Header text style
            },
          }}
        />
      </Stack.Navigator>
  );


  
}
const Auth = () => {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const HomeScreenNavigation = () =>{
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      
    </Stack.Navigator>
  );
}
const ForgetPassNavigation = () =>{
  return (
    <Stack.Navigator initialRouteName="ForgetPass">
      <Stack.Screen
        name="ForgetPass"
        component={ForgetPass}
        options={{headerShown: false}}
      />
      
    </Stack.Navigator>
  );
}
const OrderDetailsStackNavigator = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="OrderDetailsScreen">
        <Stack.Screen
          name="OrderDetailsScreen"
          component={OrderDetailsScreen}
          options={{
            title: 'Order Details', //Set Header Title
            headerRight: () => ( 
              <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
                <FontAwesome style={{padding: 7, marginRight: 10,}} name="user-circle" size={24} color="#2C2A2A" />
              </TouchableOpacity>
            ), //Set Header right icon
            headerLeft: () =>(
              <TouchableOpacity onPress={() => navigation.goBack()}>
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
const App = (props) => {

  const [isAuthUser, setIsAuthUser] = useState(null);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    console.log("For testing purpose start");
    readData();
    console.log("For testing purpose end");

    firebasenotification()

    PushNotification.createChannel({
      channelId: "my-channel", // (required)
      channelName: "My channel", // (required)
   },
   (created) => console.log(`CreateChannel returned '${created}'`)
   );
    
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        PushNotification.localNotification({
          title:remoteMessage.notification.title,
          message:remoteMessage.notification.body
        });
      });
   
    
      return unsubscribe;
  }, []);

 // async function registerAppWithFCM() {  messaging().setAutoInitEnabled(true) }

  const firebasenotification = async () => {
    Firebase.initializeApp(this)

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log("TOKEN:", token);
    _storeData("token", token.token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
    try {
      this.setState({
        pushNotification: notification,
        visible: true,
      });
    

     if (notification.foreground) {
      PushNotification.localNotification({
        //channelId : 1,
        channelId: "channel-id",
        title:notification.title,
        message:notification.message
      });

      notification.finish(PushNotificationIOS.FetchResult.NoData);
    }
    } catch (error) {
    } 
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function(err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
    foreground:true
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,

});
  }


  const readData = async () => {


    try {
      const value = await AsyncStorage.getItem('userId');
      if(value !== null){
        console.log("values are from storage data in app.js  >>> " + value);  
        setIsAuthUser(value);
        console.log("after calling the navigation");
      }else{
        //navigation.replace('Auth');
      }
    } catch (e) {
      console.log('Failed to fetch the data from storage');
    }

    remove("lat")
    remove("lng")
    
  }

  const remove =async (key) =>{
    try {
        await AsyncStorage.removeItem(key);
        return true;
    }
    catch(exception) {
        return false;
    }
  }
    return (
      <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="DemoScreen">
          {/* SplashScreen which will come once for 5 Seconds */}
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            // Hiding header for Splash Screen
            options={{headerShown: false}}
          />
          {/* Demo Screen Sliders */}
          <Stack.Screen
            name="DemoScreen"
            component={DemoScreenStackNavigator}
            options={{headerShown: false}}
          />
          {/* Auth Navigator: Include Login and Signup */}
          <Stack.Screen
            name="Auth"
            component={Auth}
            options={{headerShown: false}}
          />
          {/* Product navigator */}
          <Stack.Screen
            name="ProductScreen"
            component={ProductsStackNavigator}
            options={{headerShown: false}}
          />
          {/* Product navigator */}
          <Stack.Screen
            name="PromocodeScreen"
            component={PromocodeScreenStackNavigator}
            options={{headerShown: false}}
          />
          {/* profile navigator */}
          <Stack.Screen
            name="ProfileScreen"
            component={ProfileStackNavigator}
            options={{headerShown: false}}
          />
          {/* order navigator */}
          <Stack.Screen
            name="OrderScreen"
            component={OrderStackNavigator}
            options={{headerShown: false}}
          />
          {/* rewards navigator */}
          <Stack.Screen
            name="RewardsScreen"
            component={RewardsScreenStackNavigator}
            options={{headerShown: false}}
          />
           {/* rewards navigator */}
           <Stack.Screen
            name="InstantCartItem"
            component={InstantCartItemScreenStackNavigator}
            options={{headerShown: false}}
          />
          {/* order navigator */}
          <Stack.Screen
            name="OrderDetailsScreen"
            component={OrderDetailsStackNavigator}
            options={{headerShown: false}}
          />
          {/* order navigator */}
          <Stack.Screen
            name="OrderCancelPageScreen"
            component={OrderCancelPageStackNavigator}
            options={{headerShown: false}}
          />
           {/* wallet navigator */}
           <Stack.Screen
            name="WalletScreen"
            component={WalletStackNavigator}
            options={{headerShown: false}}
          />
           <Stack.Screen
            name="MapComponent"
            component={MapComponentStackNavigator}
            options={{headerShown: false}}
          />
           {/* wallet navigator */}
           <Stack.Screen
            name="CartScreen"
            component={CartStackNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CheckOutScreen"
            component={CheckOutScreenStackNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddressScreen"
            component={AddressScreenStackNavigator}
            options={{headerShown: false}}
          />
         
          {/* Navigation Drawer as a landing page */}
          <Stack.Screen
            name="DrawerNavigationRoutes"
            component={DrawerNavigationRoutes}
            // Hiding header for Navigation Drawer
            options={{headerShown: false}}
          />
          {/* Navigation Drawer as a landing page */}
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreenNavigation}
            // Hiding header for Navigation Drawer
            options={{headerShown: false}}
          />
          {/* Navigation Drawer as a landing page */}
          <Stack.Screen
            name="ForgetPass"
            component={ForgetPassNavigation}
            // Hiding header for Navigation Drawer
            options={{headerShown: false}}
          />
  
          {/* <Stack.Screen
            name="StripeMain"
            component={StripeMainStackNavigator}
            // Hiding header for Navigation Drawer
            options={{headerShown: false}}
          /> */}
          {/** Search Navigator */}
          <Stack.Screen
            name="Search"
            component={SearchScreen}
            
            options={({navigation}) => ({
              title: 'Search', //Set Header Title
              headerRight: () => ( 
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <FontAwesome style={{padding: 7, marginRight: 10,}} name="user-circle" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              ), //Set Header right icon
              headerStyle: {
                backgroundColor: '#062FFF', //Set Header color
              },
              headerLeft: () =>(
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
            </TouchableOpacity>
              ),
              headerTintColor: '#fff', //Set Header text color
              headerTitleStyle: {
                fontWeight: 'normal', //Set Header text style
              },
            })}/>
            {/* Product navigator */}
          <Stack.Screen
            name="Product"
            component={ProductsScreen}
            options={({navigation}) => ({
              title: 'Products', //Set Header Title
              headerRight: () => ( 
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                  <FontAwesome style={{padding: 7, marginRight: 10,}} name="user-circle" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              ), //Set Header right icon
              headerStyle: {
                backgroundColor: '#062FFF', //Set Header color
              },
              headerLeft: () =>(
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
            </TouchableOpacity>
              ),
              headerTintColor: '#fff', //Set Header text color
              headerTitleStyle: {
                fontWeight: 'normal', //Set Header text style
              },
            })}
          />
          {/* Product navigator */}
          {/* <Stack.Screen
            name="PaymentStripe"
            component={PaymentStripe}
            options={({navigation}) => ({
              title: 'Payment Options', //Set Header Title
              headerStyle: {
                backgroundColor: '#062FFF', //Set Header color
              },
              headerTintColor: '#fff', //Set Header text color
              headerTitleStyle: {
                fontWeight: 'normal', //Set Header text style
              },
              headerLeft: () =>(
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={26} color="#ffffff" />
            </TouchableOpacity>
              ),
            })}
          /> */}
          {/* AddtoCart page navigator */}
          <Stack.Screen
            name="AddtoCartPage"
            component={AddtoCartPage}
            options={({navigation}) => ({
              title: 'Products', //Set Header Title
              headerStyle: {
                backgroundColor: '#062FFF', //Set Header color
              },
              headerLeft: () =>(
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={24} color="#ffffff" />
            </TouchableOpacity>
              ),

              headerTintColor: '#fff', //Set Header text color
              headerTitleStyle: {
                fontWeight: 'normal', //Set Header text style
              },
            })}
          />
          {/* Add address page navigator */}
          <Stack.Screen
            name="AddAddressScreen"
            component={AddAddressScreen}
            options={({navigation}) => ({
              title: 'Add or Update Address', //Set Header Title
              headerStyle: {
                backgroundColor: '#062FFF', //Set Header color
              },
              headerLeft: () =>(
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesome style={{padding: 7, marginRight: 10,}} name="arrow-left" size={24} color="#ffffff" />
            </TouchableOpacity>
              ),

              headerTintColor: '#fff', //Set Header text color
              headerTitleStyle: {
                fontWeight: 'normal', //Set Header text style
              },
            })}
          />
               
          {/* Add payment option page navigator */}
          {/* <Stack.Screen
            name="PaymentOptions"
            component={PaymentOptions}
            options={{
              title: 'Payment Options', //Set Header Title
              headerStyle: {
                backgroundColor: '#062FFF', //Set Header color
              },
              headerTintColor: '#fff', //Set Header text color
              headerTitleStyle: {
                fontWeight: 'normal', //Set Header text style
              },
            }}
          /> */}
          <Stack.Screen
            name="PaymentOptions"
            component={PaymentOptionsStackNavigator}
            options={{headerShown: false}}
          />
  
        </Stack.Navigator>
      </NavigationContainer>
      </Provider>
    );
};


export default App;