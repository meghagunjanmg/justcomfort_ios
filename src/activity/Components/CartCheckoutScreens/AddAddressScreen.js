import React,{useState,useEffect, createRef} from "react";
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, ScrollView, Picker, Image, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import {connect} from "react-redux";
import {getItems,getLocation,updatedCart,getHomescreenData,getUserAddress} from "../../../actions/itemsAction";
import { TextInput } from "react-native-gesture-handler";
import Toast from 'react-native-simple-toast';
import DropDownPicker from 'react-native-dropdown-picker';

const AddAddressScreen = (props) => {
    const index = props.route.params.index;
    const addressDetails= props.route.params.selectedAddress;
    useEffect(() => {
        changeAddress()
          }, [])
    console.log(addressDetails)

    const [addressData,changeAddressData] = useState(props.item.userAddressData);
    const [pincode, setPincode] = useState(props.route.params.selectedAddress.pincode);
    const [address1, setAddress1] = useState(props.route.params.selectedAddress.house_no);
    const [address2, setAddress2] = useState(props.route.params.selectedAddress.house_no);
    const [city, setCity] = useState(props.route.params.selectedAddress.city);
    const [province, setProvince] = useState(props.route.params.selectedAddress.state);
    const [landmark, setLandmark] = useState(props.route.params.selectedAddress.landmark);
    const [name, setName] = useState(props.route.params.selectedAddress.receiver_name == "" ? props.route.params.selectedAddress.receiver_name : props.item.userdata.user_name);
    const [phoneNumber, setPhoneNumber] = useState(props.route.params.selectedAddress.receiver_phone == "" ? props.route.params.selectedAddress.receiver_phone : props.item.userdata.user_phone);
    const [errortext, setErrortext] = useState('');
    const [loading, setLoading] = useState(false);

    const address1InputRef = createRef();
    const landmarkInputRef = createRef();
    const phoneInputRef = createRef();
    const alternatePhoneInputRef = createRef();

   
   
    const saveAddress = () => {
        setErrortext('');
        if (!pincode) {
            alert('Please enter pincode');
            return;
        }
        if (!address1) {
            alert('Please enter house no');
            return;
        }
        if (!name) {
            alert('Please enter name');
            return;
        }
        if (!phoneNumber) {
            alert('Please enter mobile number');
            return;
        }
        if (!landmark) {
            setLandmark(" ");
        }
        setLoading(true);
        var url;
        var dataToSend;
        if(props.route.params.selectedAddress != ""){
           
            url = 'http://justcomfort.umbeo.com/admin/api/edit_address';

            dataToSend = {address_id: props.route.params.selectedAddress, 
                user_id: props.item.userdata.user_id, receiver_name: name,
                receiver_phone: phoneNumber,
                city_name: city, society_name: address2, 
                house_no: address1, landmark: landmark, 
                state: province, pin: pincode, 
                lat: props.item.latitude, lng: props.item.longitude};

        }else{
            url = 'http://justcomfort.umbeo.com/admin/api/add_address'

            dataToSend = {user_id: props.item.userdata.user_id, receiver_name: name,
                receiver_phone: phoneNumber,
                city_name: city, society_name: address2, 
                house_no: address1, landmark: landmark, 
                state: province, pin: pincode, 
                lat: props.item.latitude, lng: props.item.longitude};
        }

        let formBody = [];
        for (let key in dataToSend) {
            let encodedKey = encodeURIComponent(key);
            let encodedValue = encodeURIComponent(dataToSend[key]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        console.log(formBody);

        fetch(url, {
            method: 'POST',
            body: formBody,
            headers: {
                //Header Defination
                'Content-Type':
                'application/x-www-form-urlencoded;charset=UTF-8',
            },
        }).then((response) => response.json()).then((responseJson) => {
            //Hide Loader
            setLoading(false);
            console.log(responseJson)
            {
                var index=addressData.length;
                var formdata1 = new FormData();
                formdata1.append("user_id", props.item.userdata.user_id);
                formdata1.append("store_id", props.item.homepageData.recent_selling[0].store_id);
                var requestOptions = {
                  method: 'POST',
                  body: formdata1,
                  redirect: 'follow'
                };
                fetch("http://justcomfort.umbeo.com/admin/api/show_address", requestOptions)
                  .then(response => response.json())
                  .then(result => {
                    changeAddressData(result.data);
                    props.getUserAddress(result.data)
                  })
                  .catch(error => console.log('error', error));
            }
            Toast.show("Address added or updated successfully!");

        props.navigation.replace("AddressScreen");
            //props.navigation.navigate("AddressScreen");
            // If server response message same as Data Matched
        }).catch((error) => {
            //Hide Loader
            Toast.show("We are encountring error while updating data!!");
            setLoading(false);
            console.error(error);
        });

    }
    

    const changeAddress = () => {
        var index=addressData.length;
        var formdata1 = new FormData();
        formdata1.append("user_id", props.item.userdata.user_id);
        formdata1.append("store_id", props.item.homepageData.recent_selling[0].store_id);
        var requestOptions = {
          method: 'POST',
          body: formdata1,
          redirect: 'follow'
        };
        fetch("http://justcomfort.umbeo.com/admin/api/show_address", requestOptions)
          .then(response => response.json())
          .then(result => {
            props.getUserAddress(result.data)

            for(var i = 0;i<result.data.length;i++){
                if(result.data[i].address_id==addressDetails){
                console.log(result.data[i].house_no);
                setAddress1(result.data[i].house_no)
                setAddress2(result.data[i].society)
                setCity(result.data[i].city)
                setPincode(result.data[i].pincode)
                setProvince(result.data[i].state)

                }
        }
          })
          .catch(error => console.log('error', error));
    }
    return(
        <View>
            <ScrollView>
                <View style={styles.SectionStyle}>
                    <TextInput
                        style={styles.inputStyle}
                        placeholder="Street Address *"
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#6C6969"
                        keyboardType="default"
                        returnKeyType="next"
                        value={address1}
                        blurOnSubmit={false}
                        onChangeText={setAddress1}
                        onSubmitEditing={() =>
                            address1InputRef.current &&
                            address1InputRef.current.focus()
                        }
                    />
                </View>
                <View style={styles.SectionStyle}>
                    <TextInput
                        style={styles.inputStyle}
                        placeholder="Apartment Number (Optional)"
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#6C6969"
                        keyboardType="default"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        value={address2}
                        onChangeText={setAddress2}
                        onSubmitEditing={() =>
                            landmarkInputRef.current &&
                            landmarkInputRef.current.focus()
                        }
                    />
                </View>
                <View style={styles.SectionStyle}>
                    <TextInput
                        style={styles.inputStyle}
                        placeholder="City"
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#6C6969"
                        keyboardType="default"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        value={city}
                        onChangeText={setCity}
                        onSubmitEditing={() =>
                            landmarkInputRef.current &&
                            landmarkInputRef.current.focus()
                        }
                    />
                </View>
                <View style={styles.SectionStyle}>
                    <TextInput
                        style={{width: "47%", borderBottomWidth: 1,borderColor: '#514C4C', paddingLeft: 10, color: '#424242',}}
                        placeholder="Zip Code"
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#6C6969"
                        keyboardType="default"
                        returnKeyType="next"
                        value={pincode}
                        blurOnSubmit={false}
                        onChangeText={setPincode}
                        onSubmitEditing={() =>
                            landmarkInputRef.current &&
                            landmarkInputRef.current.focus()
                        }
                    />

                    <Picker
                            selectedValue={province}
                            style={{width: "47%", borderBottomWidth: 1,borderColor: '#514C4C', paddingLeft: 10}}
                            onValueChange={(itemValue, itemIndex) => setProvince(itemValue)}
                        >
                            <Picker.Item label="Alberta" value="AB" />
                            <Picker.Item label="British Columbia" value="BC" />
                            <Picker.Item label="Manitoba" value="MB" />
                            <Picker.Item label="New Brunswick" value="NB" />
                            <Picker.Item label="Newfoundland and Labrador" value="NL" />
                            <Picker.Item label="Nova Scotia" value="NS" />
                            <Picker.Item label="Ontario" value="ON" />
                            <Picker.Item label="Prince Edward Island" value="PE" />
                            <Picker.Item label="Quebec" value="QC" />
                            <Picker.Item label="Saskatchewan" value="SK" />
                            <Picker.Item label="Northwest Territories" value="NT" />
                            <Picker.Item label="Nunavut" value="NU" />
                            <Picker.Item label="Yukon" value="YT" />
                    </Picker>
                </View>
                
                <View style={styles.SectionStyle}>
                    <TextInput
                        style={styles.inputStyle}
                        placeholder="Name *"
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#6C6969"
                        keyboardType="default"
                        returnKeyType="next"
                        value={name}
                        blurOnSubmit={false}
                        onChangeText={setName}
                        onSubmitEditing={() =>
                            phoneInputRef.current &&
                            phoneInputRef.current.focus()
                        }
                    />
                </View>
                <View style={styles.SectionStyle}>
                    <TextInput
                        style={styles.inputStyle}
                        placeholder="10-digit mobile number *"
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#6C6969"
                        keyboardType="default"
                        returnKeyType="next"
                        value={phoneNumber}
                        blurOnSubmit={false}
                        onChangeText={setPhoneNumber}
                        onSubmitEditing={() =>
                            alternatePhoneInputRef.current &&
                            alternatePhoneInputRef.current.focus()
                        }
                    />
                </View>
                <TouchableOpacity style={styles.buttonStyle} 
                    activeOpacity={0.5}
                    onPress={saveAddress}>
                  <Text style={styles.buttonTextStyle}>Save Address</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
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
  export default connect(mapStateToProps, {getItems,getLocation,updatedCart,getHomescreenData,getUserAddress})(AddAddressScreen);

  const styles = StyleSheet.create({
    container: {
        margin: 8,
        marginTop: 8,
        flex: 1,
    },
    inputStyle: {
        flex: 1,
        color: '#424242',
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomWidth: 1,
        borderColor: '#514C4C',
    },
    SectionStyle: {
        flexDirection: 'row',
        height: 45,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        margin: 10,
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
        marginTop: 10,
        marginBottom: 25,
    },
      buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
  });