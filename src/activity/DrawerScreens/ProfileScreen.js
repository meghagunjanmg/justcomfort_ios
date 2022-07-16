import React, {useState,useEffect, createRef} from "react";
import AsyncStorage from '@react-native-community/async-storage';

import { StyleSheet,
  Text,
  View,
  Image,
  Keyboard,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch, 
  SafeAreaView,
  Alert,
  Button, Modal, 
         Dimensions 
 } from "react-native";
 import { StatusBar } from "expo-status-bar";

import { SimpleLineIcons, Entypo, FontAwesome, MaterialIcons} from '@expo/vector-icons'; 
import {connect} from "react-redux";
import {updateUserdetails,UpdateNotifyByData} from "../../actions/itemsAction";
import Toast from 'react-native-simple-toast';
import Loader from '../Components/Loader';
import { NavigationEvents } from "react-navigation";
import {_storeData, _retrieveData} from "../Storage";

const { width } = Dimensions.get("window");


const ProfileScren = (props) => {
 
    // This is to manage Modal State
    const [isModalVisible, setModalVisible] = useState(false);
  
    // This is to manage TextInput State
    const [inputValue, setInputValue] = useState("");
  
    // Create toggleModalVisibility function that will
    // Open and close modal upon button clicks.
    const toggleModalVisibility = () => {
        setModalVisible(!isModalVisible);
    };
  
  const navigation = props.navigation
  const [firstName, setFirstName] = useState(props.item.userdata.first_name);
  const [lastName, setLastName] = useState(props.item.userdata.last_name);
  const [showButton, setShowButton] = useState(false);
  const [number, setNumber] = useState(props.item.userdata.user_phone);
  const [email, setEmail] = useState(props.item.userdata.user_email);
  const [userImage, setUserImage] = useState(props.item.userdata.user_image);
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [photo,setPhoto] =useState(null);
  // const lastNameInputRef = createRef();
  // const phoneNumberInputRef = createRef();
  // const emailIdInputRef = createRef();
  // const passwordInputRef = createRef();

  const [isEnabledAutoPay, setIsEnabledAutoPaY] = useState();

  const [isEnabledSms,setIsEnabledSms] = useState(props.item.notifyByData.sms === 1?true:false)
  const [isEnabledApp, setIsEnabledApp] = useState(props.item.notifyByData.app === 1?true:false);
  const [isEnabledEmail, setIsEnabledEmail] = useState(props.item.notifyByData.email === 1?true:false);
  const toggleSwitchSms = () => setIsEnabledSms(!isEnabledSms);
  const toggleSwitchEmail = () => setIsEnabledEmail(!isEnabledEmail);
  const toggleSwitchApp = () => setIsEnabledApp(!isEnabledApp);


  const toggleSwitchAutoPay = () => {
    setIsEnabledAutoPaY(!isEnabledAutoPay);

    if(isEnabledAutoPay) _storeData("autopay",'0');
    else _storeData("autopay",'1');
  }
  
  // console.log(`The userdata is :- ${props.item.userdata.user_name}`)

  useEffect(() => {
    
    if(props.item.userdata.user_name === undefined)
    navigation.replace("Auth");

    updateNotify()
  }, []);
  
  const updateUserdata = async () =>
  {
    console.log("Update User Data Called");
    setLoading(true);
    
    var formdata = new FormData();
    formdata.append("user_id", props.item.userdata.user_id);
    formdata.append("first_name", firstName);
    formdata.append("last_name", lastName);
    formdata.append("user_phone", number);
    formdata.append("user_email", email);
      
    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };
    
     await fetch("http://justcomfort.umbeo.com/admin/api/profile_edit", requestOptions)
      .then(response => response.json())
      .then( async (result) => {
        const temp = props.item.userdata;
          temp.user_name=firstName+" "+lastName;
          temp.first_name=firstName;
          temp.last_name=lastName;
          temp.user_email=email;
          temp.user_phone=number;
          console.log("user data updated")
          await props.updateUserdetails(temp);
          await Toast.show("User data updated!!")
          setLoading(false);
          props.navigation.replace("DrawerNavigationRoutes")
      }
        )
      .catch(error => {
        console.log('error', error)
        Toast.show("We are encountring error while updating data!!");
        setLoading(false);
      });

  }
  const handleNotifyBySave = () =>
  {
    setLoading(true);
    var tempData={
      noti_id: props.item.notifyByData.noti_id,
      user_id: props.item.notifyByData.user_id,
      sms: isEnabledSms,
      app: isEnabledApp,
      email: isEnabledEmail
    }
    // console.log("TempData is:-"+isEnabledSms+isEnabledApp+isEnabledEmail)
    var formdata = new FormData();
    formdata.append("user_id", props.item.userdata.user_id);
    formdata.append("sms", isEnabledSms?1:0);
    formdata.append("app", isEnabledApp?1:0);
    formdata.append("email", isEnabledEmail?1:0);
    // console.log("form data is :- "+JSON.stringify(formdata));
    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    fetch("http://justcomfort.umbeo.com/admin/api/updatenotifyby", requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result)
        props.UpdateNotifyByData(tempData);


        updateNotify()

        Toast.show("Alerts data saved!!");
        setLoading(false);
      })
      .catch(error => {
        console.log('error', error)
        setLoading(false);
      });
  }


  const updateNotify= async() => {

    const value =  await AsyncStorage.getItem('autopay');
    console.error(value);
    if(value ==='1') setIsEnabledAutoPaY(true)
    else setIsEnabledAutoPaY(false)


    var formdata = new FormData();
    formdata.append("user_id", props.item.userdata.user_id);

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };
    
    fetch("http://justcomfort.umbeo.com/admin/api/notifyby", requestOptions)
    .then(response => response.json())
    .then(result => {
      if(result.data.sms==1) {
        setIsEnabledSms(true)
      }
      if(result.data.email==1) {
        setIsEnabledEmail(true)
      }
      if(result.data.app==1) {
        setIsEnabledApp(true)
      }
    })
    .catch(error => console.log('error', error));
  }


  const checkpassword = () =>{

    let dataToSend = {user_id:  props.item.userdata.user_id , user_password:inputValue};
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    console.log(formBody);

    fetch('http://justcomfort.umbeo.com/admin/api/checkpassword', 
    {
      method: 'POST',
      body: formBody,
      headers: 
      {
        //Header Defination
        'Content-Type':
        'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) =>{
      return(response.json())})
      .then((responseJson) => {
        console.log(`data of search as response ${responseJson.message}`);
        if (responseJson.status === '1') {
          toggleSwitchAutoPay();
          toggleModalVisibility();
        } })
        .catch((error) => {
          //Hide Loader
          console.error(error);
        });
  }
  
  return(
    <SafeAreaView style={styles.mainBody}>
      <Loader loading={loading} />
          <ScrollView>
                  {userImage !== "1"
                  ?<View style={{alignItems: 'center'}}>
                      <TouchableOpacity>
                          <FontAwesome style={{padding: 7, marginRight: 10,}} name="user-circle" size={150} color="#062FFF" />
                      </TouchableOpacity>
                  </View>:
                  <View style={{alignItems: 'center'}}>
                    <Image
                    style={styles.imageStyle}
                    source={{
                    //banner: bannerPhoto.banner_image,
                    uri:userImage
                    }}
                    //style={styles.imageStyle}
                  />
                  </View>}
  
                  <View style={styles.SectionStyle}>
                      <FontAwesome style={styles.keyIcon} name="user-circle" size={20} color="#062FFF" />
                      <TextInput
                          style={styles.inputStyle}
                          textContentType="name"
                          // placeholder={name}
                          defaultValue={firstName}
                          underlineColorAndroid="transparent"
                          placeholderTextColor="#6C6969"
                          keyboardType="default"
                          returnKeyType="next"
                          // ref={lastNameInputRef}
                          // onSubmitEditing={() =>
                          //   phoneNumberInputRef.current &&
                          //   phoneNumberInputRef.current.focus()
                          // }
                          onChangeText={async (newword) => {
                            setFirstName(newword);
                            await setShowButton(true);
                            console.log("show button:-"+showButton);
                          }}
                          blurOnSubmit={false}
                      />
                      {/* <Text 
                      style={styles.inputStyle}>{name}</Text> */}
                  </View>

                  <View style={styles.SectionStyle}>
                      <FontAwesome style={styles.keyIcon} name="user-circle" size={20} color="#062FFF" />
                      <TextInput
                          style={styles.inputStyle}
                          textContentType="name"
                          // placeholder={name}
                          defaultValue={lastName}
                          underlineColorAndroid="transparent"
                          placeholderTextColor="#6C6969"
                          keyboardType="default"
                          returnKeyType="next"
                          // ref={lastNameInputRef}
                          // onSubmitEditing={() =>
                          //   phoneNumberInputRef.current &&
                          //   phoneNumberInputRef.current.focus()
                          // }
                          onChangeText={async (newword) => {
                            setLastName(newword);
                            await setShowButton(true);
                            console.log("show button:-"+showButton);
                          }}
                          blurOnSubmit={false}
                      />
                      {/* <Text 
                      style={styles.inputStyle}>{name}</Text> */}
                  </View>
  
                  <View style={styles.SectionStyle}>
                      <FontAwesome style={styles.keyIcon} name="mobile" size={20} color="#062FFF" />
                      <TextInput
                          style={styles.inputStyle}
                          textContentType="telephoneNumber"
                          defaultValue={number}
                          underlineColorAndroid="transparent"
                          placeholderTextColor="#6C6969"
                          keyboardType="numeric"
                          returnKeyType="next"
                          // ref={lastNameInputRef}
                          // onSubmitEditing={() =>
                          //   phoneNumberInputRef.current &&
                          //   phoneNumberInputRef.current.focus()
                          // }
                          onChangeText={async (number) =>{ 
                            setNumber(number)
                            await setShowButton(true);
                            console.log("show button:-"+showButton);
                          }}
                          blurOnSubmit={false}
                      />
                      {/* <Text 
                      style={styles.inputStyle}>{email}</Text> */}
                  </View>
  
                  <View style={styles.SectionStyle}>
                      <FontAwesome style={styles.keyIcon} name="envelope" size={20} color="#062FFF" />
                      <TextInput
                          style={styles.inputStyle}
                          defaultValue={email}
                          textContentType="emailAddress"
                          underlineColorAndroid="transparent"
                          placeholderTextColor="#6C6969"
                          keyboardType="default"
                          returnKeyType="next"
                          // ref={lastNameInputRef}
                          // onSubmitEditing={() =>
                          //   phoneNumberInputRef.current &&
                          //   phoneNumberInputRef.current.focus()
                          // }
                          onChangeText={async (email) => {
                            setEmail(email)
                            await setShowButton(true);
                            console.log("show button:-"+showButton);}}
                          blurOnSubmit={false}
                      />
                      {/* <Text 
                      style={styles.inputStyle}>{number}</Text> */}
                  </View>
                  <TouchableOpacity 
                    style={{
                      backgroundColor: '#ffffff',
                      borde1rWidth: 0,
                      color: '#FFFFFF',
                      borderColor: '#7DE24E',
                      height: 40,
                      flexDirection: 'row',
                      borderRadius: 10,
                      marginTop: 20,
                      margin: 10,
                  }} >
                    <Text style={styles.buttonTextStyle1}>Auto Pay</Text>
                    <Switch
                              style={{left: 200,alignSelf:'center'}}
                              trackColor={{ false: "#767577", true: "#F9AA93" }}
                              thumbColor={isEnabledAutoPay ? "#062FFF" : "#f4f3f4"}
                              ios_backgroundColor="#3e3e3e"
                              onValueChange={() => toggleModalVisibility()}
                              value={isEnabledAutoPay}
                          />
                  </TouchableOpacity>

                  <View style={styles.SectionStyleAlertSection}>
                      <View style={styles.alertViewSection}>
                          <TouchableOpacity style={styles.productLeftSection}>
                              <Text>How do you want your alerts?</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                           onPress={handleNotifyBySave}
                           style={styles.productSection} activeOpacity={0.5}>
                              <Text style={styles.SaveTextStyle}>SAVE</Text>
                          </TouchableOpacity>
                      </View>
  
                      <View style={styles.alertViewSection}>
                          <TouchableOpacity style={styles.productLeftSection}>
                              <Text>Email</Text>
                          </TouchableOpacity>
                          <Switch
                              style={{left: 230,top: 10,}}
                              trackColor={{ false: "#767577", true: "#F9AA93" }}
                              thumbColor={isEnabledEmail ? "#062FFF" : "#f4f3f4"}
                              ios_backgroundColor="#3e3e3e"
                              onValueChange={() => toggleSwitchEmail()}
                              value={isEnabledEmail}
                          />
                      </View>
  
                      <View style={styles.alertViewSection}>
                          <TouchableOpacity style={styles.productLeftSection}>
                              <Text>In App</Text>
                          </TouchableOpacity>
                          <Switch
                              style={{left: 225,top: 10,}}
                              trackColor={{ false: "#767577", true: "#F9AA93" }}
                              thumbColor={isEnabledApp ? "#062FFF" : "#f4f3f4"}
                              ios_backgroundColor="#3e3e3e"
                              onValueChange={() => toggleSwitchApp()}
                              value={isEnabledApp}
                          />
                      </View>

                      <View style={styles.alertViewSection}>
                          <TouchableOpacity style={styles.productLeftSection}>
                              <Text>Sms</Text>
                          </TouchableOpacity>
                          <Switch
                              style={{left: 237,top: 10,}}
                              trackColor={{ false: "#767577", true: "#F9AA93" }}
                              thumbColor={isEnabledSms ? "#062FFF" : "#f4f3f4"}
                              ios_backgroundColor="#3e3e3e"
                              onValueChange={() => toggleSwitchSms()}
                              value={isEnabledSms}
                          />
                      </View>
                      
                  </View>

                  <TouchableOpacity 
                    onPress={() => props.navigation.push("AddressScreen")}
                    style={{
                      backgroundColor: '#ffffff',
                      borderWidth: 0,
                      color: '#FFFFFF',
                      borderColor: '#7DE24E',
                      height: 40,
                      flexDirection: 'row',
                      borderRadius: 10,
                      marginTop: 20,
                      margin: 10,
                  }} >
                    <Text style={styles.buttonTextStyle1}>My Addresses</Text>
                  </TouchableOpacity>


                  <TouchableOpacity 
                      //props.navigation.push("WalletScreen")
                      onPress={toggleModalVisibility} 
                    style={{
                      backgroundColor: '#ffffff',
                      borderWidth: 0,
                      color: '#FFFFFF',
                      borderColor: '#7DE24E',
                      height: 40,
                      flexDirection: 'row',
                      borderRadius: 10,
                      marginTop: 20,
                      margin: 10,
                  }} >
                    <Text style={styles.buttonTextStyle1}>My Wallet</Text>
                  </TouchableOpacity>
                  {
                    isModalVisible ?
                    <Modal animationType="slide" 
                    transparent visible={isModalVisible} 
                    presentationStyle="overFullScreen" 
                    onDismiss={toggleModalVisibility}>
                 <View style={styles.viewWrapper}>
                     <View style={styles.modalView}>
                         <TextInput placeholder="Enter Password..." 
                                    value={inputValue} style={styles.textInput} 
                                    onChangeText={(value) => setInputValue(value)} />

                          <View style={{flexDirection:'row'}}>
                         {/** This button is responsible to close the modal */}
                         <Button style={{margin:12,padding:12}} title="Close" onPress={toggleModalVisibility} />
                         <Button style={{margin:12,padding:12}} title="Submit" 
                         onPress={checkpassword} />
                         </View>
                     </View>
                 </View>
             </Modal>
                    :
                    <View></View>


                  }
             
               <TouchableOpacity 
                    onPress={() => props.navigation.push("OrderScreen")}
                    style={{
                      backgroundColor: '#ffffff',
                      borderWidth: 0,
                      color: '#FFFFFF',
                      borderColor: '#7DE24E',
                      height: 40,
                      flexDirection: 'row',
                      borderRadius: 10,
                      marginTop: 20,
                      margin: 10,
                  }} >
                    <Text style={styles.buttonTextStyle1}>My Order</Text>
                  </TouchableOpacity>

                  {showButton?<TouchableOpacity style={{
                      backgroundColor: '#062FFF',
                      borderWidth: 0,
                      color: '#FFFFFF',
                      borderColor: '#7DE24E',
                      height: 40,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 10,
                      marginTop: 20,
                      margin: 10,
                  }} 
                      activeOpacity={0.5}
                      onPress={updateUserdata}
                      >
                      <Text style={styles.buttonTextStyle}>SAVE PROFILE</Text>
                  </TouchableOpacity>:
                  <View></View>}
                 
  
                  <TouchableOpacity 
                    onPress={() => props.navigation.navigate("Auth")}
                    style={{
                      backgroundColor: '#062FFF',
                      borderWidth: 0,
                      color: '#FFFFFF',
                      borderColor: '#7DE24E',
                      height: 40,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 10,
                      marginTop: 20,
                      margin: 10,
                  }} >
                    <Text style={styles.buttonTextStyle}>Logout</Text>
                  </TouchableOpacity>
  
          </ScrollView>
      </SafeAreaView>   
   
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



export default connect(mapStateToProps, {updateUserdetails,UpdateNotifyByData})(ProfileScren);


const styles = StyleSheet.create({
  // These are user defined styles
  screen: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff",
  },
  viewWrapper: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      elevation: 5,
      transform: [{ translateX: -(width * 0.4) }, 
                  { translateY: -90 }],
      height: 180,
      width: width * 0.8,
      backgroundColor: "#fff",
      borderRadius: 7,
  },
  textInput: {
      width: "80%",
      borderRadius: 5,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderColor: "rgba(0, 0, 0, 0.2)",
      borderWidth: 1,
      marginBottom: 8,
  },
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    height: "100%",
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#000',
    height: 40,
    borderRadius: 5,
    margin: 10,
  },
  inputStyle: {
    flex: 1,
    color: '#424242',
    paddingLeft: 10,
    paddingRight: 10,
  },
  keyIcon:{
    padding: 7,
  },
  SectionStyleAlertSection: {
    alignItems: 'baseline',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#000',
    height: 180,
    borderRadius: 5,
    margin: 10,
  },
  alertViewSection: {
    flexDirection: 'row', 
    justifyContent: "space-between",
    top: 10,
    marginBottom: 10,
  },
  productLeftSection:{
    marginLeft: 10,
    top: 10,
  },
  productSection:{
    backgroundColor: '#062FFF', 
    borderRadius: 10,
    width: 50,
    left: 80,
    top: 10,
  },
  SaveTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonStyle: {
    backgroundColor: '#062FFF',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
    margin: 10,
  },
  buttonStyleInactive: {
    backgroundColor: '#062FFF',
    opacity:0.5,
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
    margin: 10,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonTextStyle1: {
    color: '#000000',
    paddingVertical: 10,
    fontSize: 16,
    marginStart:10,
    textAlign: 'center',
  },
  imageStyle:{
    marginTop:10,
    marginBottom:20,
    width:150,
    height:150,
    borderRadius:100
  }
});

