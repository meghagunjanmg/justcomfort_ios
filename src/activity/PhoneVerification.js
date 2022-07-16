import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView 
} from 'react-native';
import { AntDesign, Entypo, FontAwesome} from '@expo/vector-icons'; 
import {connect} from "react-redux";
import {getUserData,getUserOrders,getUserPastOrders,getUserAddress,getNotifyByData,getCurrency} from "../actions/itemsAction.js";
import {_storeData, _retrieveData} from "./Storage";
import AsyncStorage from '@react-native-community/async-storage';
import Loader from './Components/Loader';
import * as Google from 'expo-google-app-auth';
import auth from '@react-native-firebase/auth';

const PhoneVerification = (props) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState();

  const [mobile, setMobile] = useState('');

  const [confirm, setConfirm] = useState(null);

  const [code, setCode] = useState('');

  const onAuthStateChanged = async userAuth => {
    if (!userAuth) {
      return;
    }
    if (userAuth) {
      console.log(userAuth);
      setUser(userAuth);
    }

    return () => userReference();
  };
  useEffect(() => {
    readData();

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => {
      subscriber;
    };
  }, []);

  const readData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if(value !== null){
        console.log("token is " + value);  
        setToken(value);
      }else{
      }
    } catch (e) {
      console.log('Failed to fetch the data from storage');
    }
  }

  const signInWithMobileNumber = async () => {
    const confirmation = await auth().signInWithPhoneNumber('+91'+mobile);
    setConfirm(confirmation);
  };

  const confirmCode = async () => {
    try {
      await confirm.confirm(code);
      loginwithotp();

    } catch (error) {
      console.log('Invalid code.');
    }
  };

  const loginwithotp = async () => {
    var user_id;
    let dataToSend = {user_phone: mobile, device_id: token};
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    await fetch('http://justcomfort.umbeo.com/admin/api/loginwithotp', {
      method: 'POST',
      body: formBody,
      headers: {
        //Header Defination
        'Content-Type':
        'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //Hide Loader
        //console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.status === '1') {
          _storeData("userId", responseJson.data[0].user_id.toString());
          _storeData("userName", responseJson.data[0].user_name.toString());

          props.getUserData(responseJson.data[0]);
          _storeData("userData", JSON.stringify(responseJson.data[0]));
          user_id=responseJson.data[0].user_id;

          props.navigation.replace("DrawerNavigationRoutes")
        }
        else  {
          props.navigation.navigate("RegisterScreen")
        }
      })
      .catch((error) => {
        //Hide Loader
        console.error(error);
      });

  }

  return (
    <View style={styles.mainBody}>
       <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
          
        }}>
          <View>
              <KeyboardAvoidingView enabled>
                <View style={{alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/ic_launcher.png')}
                    style={styles.image}
                  />
                </View>

                <View style={{alignItems: 'center'}}>
                  <Text style={styles.cred}>Sign In</Text>
                </View>

                <View style={styles.SectionStyle}>
                    <FontAwesome style={styles.keyIcon} name="user-circle" size={20} color="#062FFF" />
                    <TextInput
              value={mobile}
              onChangeText={e => setMobile(e)}
              placeholder="mobile"
             >
              </TextInput>
                </View>
                <TouchableOpacity 
                    style={{
                      backgroundColor: '#062FFF',
                      padding: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 15,
                      marginLeft: 35,
                      marginRight: 35,
                      marginTop: 10,
                      height:40
                    }} 
                    activeOpacity={0.5}
                    onPress={signInWithMobileNumber}>
                  <Text style={styles.buttonText}>Get OTP</Text>
                </TouchableOpacity>

                <View style={styles.SectionStyle}>
                    <FontAwesome style={styles.keyIcon} name="user-circle" size={20} color="#062FFF" />
                    <TextInput
                  value={code}
                  onChangeText={e => setCode(e)}
                  placeholder="Code"
                ></TextInput>
                </View>
                <TouchableOpacity 
                    style={{
                      backgroundColor: '#062FFF',
                      padding: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 15,
                      marginLeft: 35,
                      marginRight: 35,
                      marginTop: 10,
                      height:40
                    }} 
                    activeOpacity={0.5}
                    onPress={confirmCode}>
                  <Text style={styles.buttonText}>Confirm OTP</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => props.navigation.replace("DrawerNavigationRoutes")}
                  style={styles.skip}>
                  <Text style={styles.skipText}>Skip &#8594;</Text> 
                </TouchableOpacity>
              
              </KeyboardAvoidingView>
          </View>
      </ScrollView>
    </View>
  );
 }

 const mapStateToProps = (state) => {
  // console.log("State Contains:-"+ state)
  // console.log(`Map State to props:- ${state.item.homepageData.status}`)
  return({
      //Here State.post is 
      //Coming From -> "./reducers/index.js"
      //where "post" is defined under combineReducers
      item:state.item
  })
}
export default connect(mapStateToProps, {getUserData,getUserOrders,getUserAddress,getNotifyByData,getUserPastOrders,getCurrency})(PhoneVerification);
const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  image :{
    marginBottom: 20,
    marginTop: 40,
    width: 70,
    height:70,
    alignItems: "center"
  },
  fbgoogle :{
    width: 25,
    height:25,
    top: 8,
    alignItems: "flex-start",
  },
  cred: {
    alignItems: "center",
    fontSize: 20,
    marginBottom: 10,
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 10,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#dadae8',
  },
  buttonStyle: {
    backgroundColor: '#062FFF',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 25,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
    marginLeft: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonTextStyle: {
    color: '#4267B2',
    paddingVertical: 10,
    fontSize: 16,
    marginLeft: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonTextStyleGoogle: {
    color: 'red',
    paddingVertical: 10,
    fontSize: 16,
    marginLeft: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputStyle: {
    flex: 1,
    color: '#424242',
    paddingLeft: 15,
    paddingRight: 15,
  },
  registerTextStyle: {
    color: '#6C6969',
    textAlign: 'center',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  keyIcon:{
    padding: 7,
  },
  forgot_button: {
    height: 30,
    marginTop: 20,
    color: "#6C6969",
  },
  skip:{
    alignItems: "flex-end",
    width: "90%",
  },
  skipText:{
    color: "#062FFF",
    alignItems: "flex-end",
    marginTop: 30,
    fontSize: 15,

  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    color: '#FFFFFF',
    backgroundColor: "#062FFF",
    marginTop: 20,
  },
});
