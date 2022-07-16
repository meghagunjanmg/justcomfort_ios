import React, {useState, createRef} from "react";
import { StyleSheet,
  Text,
  View,
  Image,
  Keyboard,
  TextInput,
  ScrollView,
  TouchableOpacity,
  CheckBox, 
  SafeAreaView } from "react-native";
import { SimpleLineIcons, Entypo, FontAwesome, MaterialIcons} from '@expo/vector-icons'; 

import Loader from './Components/Loader';


const Signup = ({ navigation }) => {

  const [fname, setFirstName] = useState('');
  const [lname, setLastName] = useState('');
  const [number, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePass, setHidePass] = useState(true);
  const [isSelected, setSelection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');


  const lastNameInputRef = createRef();
  const phoneNumberInputRef = createRef();
  const emailIdInputRef = createRef();
  const passwordInputRef = createRef();

  const handleSubmitPress = () => {
    if (!fname) {
      alert('Please enter First Name');
      return;
    }
    if (!lname) {
      alert('Please enter Last Name');
      return;
    }
    if (!number) {
      alert('Please enter phone number');
      return;
    }
    if (!email) {
      alert('Please enter email id');
      return;
    }
    if(!validate(email)){
      alert('Please enter valid email id');
      return;
    }
    if (!password) {
      alert('Please fill Password');
      return;
    }
    if (!isSelected) {
      alert('Please agree to terms & conditions');
      return;
    }

    var formdata = new FormData();
    formdata.append("first_name", fname);
    formdata.append("last_name",lname);
    formdata.append("user_phone", number);
    formdata.append("user_email", email);
    formdata.append("user_password",  password);
    formdata.append("device_id", "corAw1y1S2W902cne0Pg27:APA91bFxXG4PYl4urev8XkoB3HLdFYXxEYpT9QbTfUUESoSF_UJUwoxALCvHmhP0K_CeRM6FvKjv3SbyClW9P9evYPYQM6MKCU5DDxtrgfOtEluy4UUrldttlacpWCaYwUd4q_mUQ9S7");

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    fetch("http://justcomfort.umbeo.com/admin/api/signup", requestOptions)
      .then(response => response.json())
      .then(result => 
        {
          if(result.message === "Login Successfully")
          {
            alert("You are Succefully Registered!!");
            navigation.replace("LoginScreen");
          }
        })
      .catch(error => console.log('error', error));
  };

  const validate = (text) => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      console.log("Email is Not Correct");
      return false;
    }
    else {
      console.log("Email is Correct");
      return true;
    }
  }

  return (
    <SafeAreaView style={styles.mainBody}>
      <Loader loading={loading} />
      <ScrollView>
                <View style={{alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/ic_launcher.png')}
                    style={styles.image}
                  />
                </View>

                <View style={{alignItems: 'center'}}>
                  <Text style={styles.cred}>Sign Up</Text>
                </View>

                <View style={styles.SectionStyle}>
                    <FontAwesome style={styles.keyIcon} name="user-circle" size={20} color="#062FFF" />
                    <TextInput
                        style={styles.inputStyle}
                        placeholder="First Name"
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#6C6969"
                        keyboardType="default"
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          lastNameInputRef.current &&
                          lastNameInputRef.current.focus()
                        }
                        onChangeText={(fname) => setFirstName(fname)}
                        blurOnSubmit={false}
                    />
                </View>

                <View style={styles.SectionStyle}>
                    <FontAwesome style={styles.keyIcon} name="user-circle" size={20} color="#062FFF" />
                    <TextInput
                        style={styles.inputStyle}
                        placeholder="Last Name"
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#6C6969"
                        keyboardType="default"
                        returnKeyType="next"
                        ref={lastNameInputRef}
                        onSubmitEditing={() =>
                          phoneNumberInputRef.current &&
                          phoneNumberInputRef.current.focus()
                        }
                        onChangeText={(lname) => setLastName(lname)}
                        blurOnSubmit={false}
                    />
                </View>

                <View style={styles.SectionStyle}>
                    <SimpleLineIcons style={styles.keyIcon} name="screen-smartphone" size={20} color="#062FFF" />
                    <TextInput
                        style={styles.inputStyle}
                        placeholder="Mobile Number"
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#6C6969"
                        keyboardType="numeric"
                        returnKeyType="next"
                        maxLength={10}
                        ref={phoneNumberInputRef}
                        onSubmitEditing={() =>
                          emailIdInputRef.current &&
                          emailIdInputRef.current.focus()
                        }
                        onChangeText={(number) => setPhoneNumber(number)}
                        blurOnSubmit={false}
                    />
                </View>

                <View style={styles.SectionStyle}>
                    <MaterialIcons style={styles.keyIcon} name="email" size={20} color="#062FFF" />
                    <TextInput
                        style={styles.inputStyle}
                        placeholder="Email ID"
                        autoCapitalize="none"
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#6C6969"
                        keyboardType="email-address"
                        returnKeyType="next"
                        ref={emailIdInputRef}
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
                        autoCapitalize="none"
                        onChangeText={(password) => setPassword(password)}
                        keyboardType="default"
                        ref={passwordInputRef}
                        onSubmitEditing={Keyboard.dismiss}
                        blurOnSubmit={false}
                        returnKeyType="next"
                    />
                    <FontAwesome style={styles.keyIcon} name={hidePass ? 'eye-slash' : 'eye'} size={20} color="#062FFF" onPress={() => setHidePass(!hidePass)} />
                </View>

                <View style={styles.checkboxContainer}>
                    <CheckBox
                      value={isSelected}
                      onValueChange={setSelection}
                      style={styles.checkbox}
                    />
                    <Text style={styles.label}>I agree to terms &amp; conditions</Text>
                </View>

                {errortext != '' ? (
                  <Text style={styles.errorTextStyle}>
                    {errortext}
                  </Text>
                ) : null}

                <TouchableOpacity style={styles.buttonStyle} 
                    activeOpacity={0.5}
                    onPress={handleSubmitPress}>
                  <Text style={styles.buttonTextStyle}>SIGN UP</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={{alignItems: 'center'}} 
                  onPress={() => navigation.replace("LoginScreen")}>
                  <Text style={styles.forgot_button}>Already have an account? Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => navigation.replace("DrawerNavigationRoutes")}
                  style={styles.skip}>
                  <Text style={styles.skipText}>Skip &#8594;</Text> 
                </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>    
  );
};

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  image :{
    marginBottom: 10,
    marginTop: 40,
    width: 60,
    height:60,
    alignItems: "center"
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
    borderRadius: 15,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 10,
    marginBottom: 5,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 15,
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
    marginTop: 5,
    color: "#6C6969",
  },
  skip:{
    alignItems: "flex-end",
    width: "90%",
  },
  skipText:{
    color: "#062FFF",
    alignItems: "flex-end",
    marginTop: 20,
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
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
});

export default Signup;