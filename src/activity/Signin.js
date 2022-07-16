import React, {useState, useEffect, createRef} from "react";
import { StyleSheet,
  Text,
  View,
  Image,
  Keyboard,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView, Alert } from "react-native";
import { AntDesign, Entypo, FontAwesome} from '@expo/vector-icons'; 
import {connect} from "react-redux";
import {getUserData,getUserOrders,getUserPastOrders,getUserAddress,getNotifyByData,getCurrency} from "../actions/itemsAction.js";
import {_storeData, _retrieveData} from "./Storage";
import AsyncStorage from '@react-native-community/async-storage';
import Loader from './Components/Loader';
import * as Google from 'expo-google-app-auth';

const Signin = (props) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [hidePass, setHidePass] = useState(true);
  const navigation = props.navigation;
  const passwordInputRef = createRef();
  const [animating, setAnimating] = useState(true);
  const [token, setToken] = useState('');
  

  var FB_APP_ID = '1875984902575389';

  const initSocialLogin = async () => {
    try {
      await Facebook.initializeAsync({
        appId: FB_APP_ID,
      });
    } catch (e) {
      console.log(e);
    }
  };
  

  useEffect(() => {
  
    //initSocialLogin()
    /*if(props.item.userdata.first_name)
    {
      console.log("Thw user data present is:-"+JSON.stringify(_retrieveData("userdata")))
      props.getUserData(_retrieveData("userdata"));
      props.getUserAddress(_retrieveData("addressDetails"));
      props.getNotifyByData(_retrieveData("notifyUser"));
      props.navigation.replace("DrawerNavigationRoutes")
    }*/
  
    
    props.getUserData({});
    props.getUserAddress([]);
    props.getNotifyByData({});
    removeId('userId');


    readData()

  }, []);
   const removeId =async (key) =>{
    try {
        await AsyncStorage.removeItem(key);
        return true;
    }
    catch(exception) {
        return false;
    }
}
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
  const googleLogin = async () => {
    try {
      const { type, accessToken, user } = await Google.logInAsync({
        androidClientId: '369379648036-f1oq5u1qi7hrhs0molhuf96nl4dkvkdv.apps.googleusercontent.com',
        iosClientId: '369379648036-edjedc7b9pulsvk4u6lagoqt5k62vuk6.apps.googleusercontent.com',
      });
  
      return { type, token: accessToken, user };
    } catch (e) {
      return { error: e };
    }
  };
  
  const handleGoogleLoginPress = async () => {
    try {
      const { type, token, user, error } = await googleLogin();
      
      if (type === 'success') {
        // DISPATCH TOKEN AND USER DATA
        // TO IMPLEMENT NAVIGATION AND USER INFO DISPLAYS
        console.log(user);
        //dispatch({ type: 'GOOGLE_LOGIN', token: accessToken, user });
      }
    } catch (e) {
      console.log('error', e);
    }
  };

  const fbLogin = async () => {
    try {
      const { token, type } = await Facebook.logInWithReadPermissionsAsync(
        FB_APP_ID,
        {
          permissions: ['public_profile'],
        }
      );
  
      // GET USER DATA FROM FB API
      const response = await fetch(
        `http://graph.facebook.com/me?access_token=${token}`
      );
      const user = await response.json();
      console.log(user);
  
      // GET PROFILE IMAGE DATA FROM FB API
      // NOTE THAT I SET THE IMAGE WIDTH TO 500 WHICH IS OPTIONAL
      const pictureResponse = await fetch(
        `http://graph.facebook.com/v8.0/${user.id}/picture?width=500&redirect=false&access_token=${token}`
      );
      const pictureOBject = await pictureResponse.json();
      const userObject = {
        ...user,
        photoUrl: pictureOBject.data.url,
      };
  
      return { type, token, user: userObject };
    } catch (e) {
      return { error: e };
    }
  };

  


  const handleSubmitPress = async () => {
    console.log("token is * " + token); 

    setErrortext('');
    if (!email) {
      alert('Please fill Phone Number');
      return;
    }
    if (!password) {
      alert('Please fill Password');
      return;
    }
    
    setLoading(true);
    var user_id;
    let dataToSend = {user_phone: email, user_password: password, device_id: token};
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    await fetch('http://justcomfort.umbeo.com/admin/api/login', {
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
        setLoading(false);
        //console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.status === '1') {
          _storeData("userId", responseJson.data[0].user_id.toString());
          _storeData("userName", responseJson.data[0].first_name.toString());

          props.getUserData(responseJson.data[0]);
          _storeData("userData", JSON.stringify(responseJson.data[0]));
          user_id=responseJson.data[0].user_id;
        } else {
          setErrortext(responseJson.message);
          console.log('Please check your email id or password');
        }
      })
      .catch((error) => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });

      var formdata = new FormData();
      formdata.append("user_id", user_id);
  
      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };
      
      fetch("http://justcomfort.umbeo.com/admin/api/notifyby", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log("notify by data:-"+result.data)
        _storeData("notifyUser", JSON.stringify(result.data));
        props.getNotifyByData(result.data)
      })
      .catch(error => console.log('error', error));

      /*var formdata1 = new FormData();
      formdata1.append("user_id", user_id);
      formdata1.append("store_id", "3");

      var requestOptions = {
        method: 'POST',
        body: formdata1,
        redirect: 'follow'
      };

      fetch("http://justcomfort.umbeo.com/admin/api/show_address", requestOptions)
        .then(response => response.json())
        .then(result => {
          _storeData("addressDetails", JSON.stringify(result.data));
          props.getUserAddress(result.data);
        })
        .catch(error => console.log('error', error));
      
      */
      fetch("http://justcomfort.umbeo.com/admin/api/currency", {method: 'GET'})
      .then(response => response.json())
      .then(result => {
        props.getCurrency(result.data.currency_name, result.data.currency_sign);
        _storeData("currency_name", JSON.stringify(result.data.currency_name));
        _storeData("currency_sign",JSON.stringify(result.data.currency_sign));
        navigation.replace('DrawerNavigationRoutes');
      })
      .catch(error => console.log('error', error));
  };

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
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
                        style={styles.inputStyle}
                        placeholder="Phone Number"
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#6C6969"
                        keyboardType="numeric"
                        returnKeyType="next"
                        maxLength={10}
                        onSubmitEditing={() =>
                          passwordInputRef.current &&
                          passwordInputRef.current.focus()
                        }
                        onChangeText={(email) => setEmail(email)}
                        blurOnSubmit={false}
                    />
                </View>

                <View style={styles.SectionStyle}>
                    <Entypo style={styles.keyIcon} name="key" size={20} color="#062FFF" />
                    <TextInput
                        style={styles.inputStyle}
                        placeholder="Password"
                        placeholderTextColor="#6C6969"
                        secureTextEntry={hidePass ? true : false}
                        onChangeText={(password) => setPassword(password)}
                        keyboardType="default"
                        ref={passwordInputRef}
                        onSubmitEditing={Keyboard.dismiss}
                        blurOnSubmit={false}
                        returnKeyType="next"
                    />
                    <FontAwesome style={styles.keyIcon} name={hidePass ? 'eye-slash' : 'eye'} size={20} color="#062FFF" onPress={() => setHidePass(!hidePass)} />
                    
                </View>

                {errortext != '' ? (
                  <Text style={styles.errorTextStyle}>
                    {errortext}
                  </Text>
                ) : null}

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
                    onPress={handleSubmitPress}>
                  <Text style={styles.buttonText}>SIGN IN</Text>
                </TouchableOpacity>

                <View style={{marginTop:10,width:"85%",marginLeft:"auto",marginRight:"auto", flexDirection: "row"}}>
                  <TouchableOpacity
                    onPress={handleGoogleLoginPress
                    }
                      style={{
                        backgroundColor: '#FFFFFF',
                        padding: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 15,
                        marginTop: 10,
                        height:40,
                        flex:1,
                        borderWidth:1,
                        borderColor:"red"
                      }}>
                    <View style={{flexDirection: "row"}}>
                      <Image source={require('../../assets/google.png')}
                      style={styles.fbgoogle}></Image>
                      <Text style={styles.buttonTextStyleGoogle}>Login</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                

                <TouchableOpacity style={{alignItems: 'center'}} onPress={() => navigation.navigate("ForgetPass")}>
                  <Text style={styles.forgot_button}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
                  <Text style={styles.registerTextStyle}>New User? Please SignUp</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => navigation.replace("DrawerNavigationRoutes")}
                  style={styles.skip}>
                  <Text style={styles.skipText}>Skip &#8594;</Text> 
                </TouchableOpacity>
              
              </KeyboardAvoidingView>
          </View>
      </ScrollView>
    </View>    
  );
};

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
export default connect(mapStateToProps, {getUserData,getUserOrders,getUserAddress,getNotifyByData,getUserPastOrders,getCurrency})(Signin);
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
