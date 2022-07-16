import React,{useState,useEffect} from "react";
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import {connect} from "react-redux";
import {getItems,getLocation,updatedCart,getHomescreenData,getUserAddress} from "../../../actions/itemsAction";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from "react-native-simple-radio-button";
import { TextInput } from "react-native-gesture-handler";
import Toast from 'react-native-simple-toast';

const AddressScreen_x = (props) => {
  var formdata1 = new FormData();
  formdata1.append("user_id", props.item.userdata.user_id);
  formdata1.append("store_id", props.item.storeId);
  var requestOptions = {
    method: 'POST',
    body: formdata1,
    redirect: 'follow'
  };
  
  fetch("http://justcomfort.umbeo.com/admin/api/show_address", requestOptions)
  .then(response => response.json())
  .then(result => {
    if (result.status === '1'){
      props.getUserAddress(result.data);
      console.log(props.getUserAddress + "\n"+ props.userAddressData);
    }else{
      setErrortext(result.message);
      console.log('Please check your API.. ' + result.message);
    }
  })
  .catch(error => console.log('error', error));

    const [loading,setLoading] = useState(false);
    useEffect(() => {
    
    }, []);
  
    
    const handleChangeAddress = (address_id) => {
        setLoading(true);
        var formdata = new FormData();
        formdata.append("address_id", address_id);

        var requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };

        fetch("http://justcomfort.umbeo.com/admin/api/select_address", requestOptions)
          .then(response => response.json())
          .then(async result => {
              console.log(result)
              if(result.status === "1")
                {
                    Toast.show("Address Selected Successfully!!");
                    await updateAddress();
                }
              else
                Toast.show("We are encountring error while updating data!!");
                setLoading(false);
                props.navigation.navigate("CartScreen");
            })
          .catch(error => {
                console.log('Error from change address api', error);
                Toast.show("We are encountring error while updating data!!");
                setLoading(false);
            });
    }
  
    const handleDeleteAddress = (address_id) => {
      setLoading(true);
      var formdata = new FormData();
      formdata.append("address_id", address_id);

      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };

      fetch("http://justcomfort.umbeo.com/admin/api/remove_address", requestOptions)
        .then(response => response.json())
        .then(async result => {
            console.log(result)
            if(result.status === "1")
              {
                  Toast.show("Address Deleted Successfully!!");
                
              }
            }
        )
            .catch(error => {
              console.log('Error from change address api', error);
              Toast.show("We are encountring error while updating data!!");
              setLoading(false);
          });

        }
    const updateAddress = () => {
        var formdata1 = new FormData();
        formdata1.append("user_id", props.item.userdata.user_id);
        formdata1.append("store_id", props.item.storeId);
        var requestOptions = {
          method: 'POST',
          body: formdata1,
          redirect: 'follow'
        };
        
        fetch("http://justcomfort.umbeo.com/admin/api/show_address", requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === '1'){
            props.getUserAddress(result.data);
            console.log(props.getUserAddress + "\n"+ props.userAddressData);
          }else{
            setErrortext(result.message);
            console.log('Please check your API.. ' + result.message);
          }
        })
        .catch(error => console.log('error', error));
    } 
return(
    <View style={{height:"100%"}}>
        <ScrollView>
            <TouchableOpacity style={{marginTop:20,backgroundColor:"#062FFF",width:"95%",marginLeft:"auto",marginRight:"auto",padding:10,alignItems:"center",borderRadius:10}}
             onPress={()=> props.navigation.navigate("AddAddressScreen", {selectedAddress: "",index:null})}
            >
                <Text style={{color:"white"}}>Add New Address</Text>
            </TouchableOpacity>
            {props.item.userAddressData.map((address,i)=>{
                return(<View key={address.address_id} style={{width:"95%",marginLeft:"auto",marginRight:"auto",backgroundColor:"white",borderRadius:7,marginTop:20,marginBottom:20,elevation:10,padding:10}}>
                <View style={{width:"95%",marginLeft:"auto",marginRight:"auto",marginBottom:15}}>
                    <Text style={{fontWeight:"bold"}}>Name:- {address.receiver_name}</Text>
                    <Text style={{color:"#7f7f7f"}}>Address:- {address.house_no}-{address.society},{address.landmark},{address.city},{address.state}-{address.pincode}</Text>
                    <Text style={{color:"#7f7f7f"}}>Contact:- {address.receiver_phone}</Text>
                </View>
                <TouchableOpacity style={{backgroundColor:"#062FFF",width:"95%",marginBottom:10,marginLeft:"auto",marginRight:"auto",padding:10,alignItems:"center",borderRadius:10}}
                 onPress={()=> props.navigation.navigate("AddAddressScreen", {selectedAddress: address,index:i})}>
                    <Text style={{color:"white"}}>Change Address</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor:"#062FFF",width:"95%",marginBottom:10,marginLeft:"auto",marginRight:"auto",padding:10,alignItems:"center",borderRadius:10}}
                 onPress={()=> handleDeleteAddress(address.address_id)}>
                    <Text style={{color:"white"}}>Delete Address</Text>
                </TouchableOpacity>

                {address.select_status !== 1 && <TouchableOpacity style={{borderColor:"#062FFF",borderWidth:1,width:"95%",marginBottom:10,marginLeft:"auto",marginRight:"auto",padding:10,alignItems:"center",borderRadius:10}}
                 onPress={()=> handleChangeAddress(address.address_id)}>
                    <Text style={{color:"#062FFF"}}>Select this Address</Text>
                </TouchableOpacity>}
            </View>);
            })}
            
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
  export default connect(mapStateToProps, {getItems,getLocation,updatedCart,getHomescreenData,getUserAddress})(AddressScreen_x);