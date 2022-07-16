import React, {useState, useEffect} from "react";
import {StyleSheet, 
  View,
  Text, 
  SafeAreaView, 
  ScrollView, 
  TextInput,
  Image, 
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Share,
  Dimensions
} from 'react-native';
import { EvilIcons, FontAwesome } from '@expo/vector-icons'; 
import SegmentedControlTab from 'react-native-segmented-control-tab';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-community/async-storage';
import {_storeData, _retrieveData} from "../Storage";
import {connect} from "react-redux";
import {getItems,getLocation,updatedCart,getHomescreenData,getUserAddress,getAllProducts, getCurrency,getDeliveryData, getUserData, getNotifyByData} from "../../actions/itemsAction.js";
import { MaterialIcons } from '@expo/vector-icons';
import AppIntroSlider from 'react-native-app-intro-slider';
import Image1 from "../../../assets/Demo1.png"
import Image2 from "../../../assets/Demo2.png"
import Image3 from "../../../assets/Demo3.png"
import Loader from "../Components/Loader.js";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
const DemoScreen = (props) => {
    const [count,setCount] = useState(1);
    const [loading,setLoading] = useState(true);
    const [errorText,setErrortext] = useState("");
    useEffect(() => {
        // let unmounted = false;

        getCurrency()
        console.log("In Demo Screen>>> ");
        readData();
        // return () => { unmounted.current = true }
      }, []);
    

      const getCurrency= () => 
{

  fetch("http://justcomfort.umbeo.com/admin/api/currency", {method: 'GET'})
  .then(response => response.json())
  .then(async result => {
    if (result.status === '1'){
      props.getCurrency(result.data.currency_name, result.data.currency_sign);
      console.log('Please check your API.. ' + result.data.currency_sign);

    }else{
      setErrortext(result.message);
      console.log('Please check your API.. ' + result.message);
    }
  })
  .catch(error => console.log('error', error));

}
      const readData = async () => {
        try {
          const value = await AsyncStorage.getItem('userId');
          if(value !== null){
            console.log("values are from storage data in DemoScreen.js  >>> " + value);  
           readUserDetails(value);
            await props.navigation.replace('DrawerNavigationRoutes');
          }
          setLoading(false);
        } catch (e) {
          console.log('Failed to fetch the data from storage');
          setLoading(false);
        }
      }
    
      const readUserDetails = (userId) => {
        let dataToSend = {user_id: userId};
        let formBody = [];
        for (let key in dataToSend) {
          let encodedKey = encodeURIComponent(key);
          let encodedValue = encodeURIComponent(dataToSend[key]);
          formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');
    
        fetch('http://justcomfort.umbeo.com/admin/api/myprofile', {
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
            // If server response message same as Data Matched
            if (responseJson.status === '1') {
              props.getUserData(responseJson.data);
            } else {
              setErrortext(responseJson.message);
              console.log('Please check your email id or password');
            }
          })
          .catch((error) => {
            //Hide Loader
            console.error(error);
          });
          
          var formdatafornoti = new FormData();
          formdatafornoti.append("user_id", "1");

          var requestOptionsfornoti = {
            method: 'POST',
            body: formdatafornoti,
            redirect: 'follow'
          };
          
          fetch("http://justcomfort.umbeo.com/admin/api/notifyby", requestOptionsfornoti)
          .then(response => response.json())
          .then(result => {
            console.log("the response of notifiby is "+ JSON.stringify(result))
            if (result.status === '1') {
              props.getNotifyByData(result.data);
            } else {
              setErrortext(result.message);
              console.log('Please check your notifiby API.. ' + result.message);
            }
          })
          .catch(error => console.log('error', error));
    
         /* var formdata1 = new FormData();
          formdata1.append("user_id", userId);
          formdata1.append("store_id", "3");
    
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
              }else{
                setErrortext(result.message);
                console.log('Please check your API.. ' + result.message);
              }
            })
            .catch(error => console.log('error', error));
          */
          

      }
    if (loading === true)
    {
      // console.log("if statement called");
      return (
        <View style={styles.spinnerView}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    else if(loading === false && AsyncStorage.getItem('userVisitedDemo') !== "true")
    {
      const value = AsyncStorage.getItem('userVisitedDemo');
      console.log("the value of userVisitedDemo is :-"+ JSON.stringify(value));
      console.log("the value of userId is :-"+ JSON.stringify(AsyncStorage.getItem('userId')));
      if(count === 1)
          return (
          <View style={{justifyContent:"center",width:ScreenWidth,backgroundColor:"white",height:ScreenHeight}}>
            <Loader loading={loading} />
              <Image 
                  source={require('../../../assets/Demo1.png')}
                  style={{marginLeft:50}}
                />
              <Text style={{fontSize:15,textAlign:"center",marginTop:20,fontSize:30,color:"grey",fontWeight:"500",width:"80%",marginLeft:"auto",marginRight:"auto"}}>Your daily needs from the comfort of your smart phone.</Text>
              <View style={{flexDirection:"row",position:"absolute",bottom:30,width:"90%",left:30}}>
                  <View style={{flex:1}}>
                      <View style={{flexDirection:"row",position:"relative",top:10}}>
                          <View style={{borderRadius:50,padding:5,backgroundColor:"red",marginLeft:5,marginRight:5}}/>
                          <View style={{borderRadius:50,padding:5,backgroundColor:"green",marginLeft:5,marginRight:5}}/>
                          <View style={{borderRadius:50,padding:5,backgroundColor:"green",marginLeft:5,marginRight:5}}/>
                      </View>
                  </View>
                  <TouchableOpacity
                      onPress={() => setCount(2)}
                      style={{padding:10,backgroundColor:"#062FFF",flex:1,borderRadius:50}}>
                      <Text style={{textAlign:"center",color:"white"}}>Next</Text>
                  </TouchableOpacity>
              </View>
          </View>)
      else if(count===2)
          return(
          <View style={{justifyContent:"center",width:ScreenWidth,backgroundColor:"white",height:ScreenHeight}}>
            <Loader loading={loading} />
              <Image 
                  source={require('../../../assets/Demo2.png')}
                  style={{marginLeft:50}}
                />
              <Text style={{fontSize:15,textAlign:"center",marginTop:20,fontSize:30,color:"grey",fontWeight:"500",width:"80%",marginLeft:"auto",marginRight:"auto"}}>Buy what you love.</Text>
              <View style={{flexDirection:"row",position:"absolute",bottom:30,width:"90%",left:30}}>
                  <View style={{flex:1}}>
                      <View style={{flexDirection:"row",position:"relative",top:10}}>
                          <View style={{borderRadius:50,padding:5,backgroundColor:"green",marginLeft:5,marginRight:5}}/>
                          <View style={{borderRadius:50,padding:5,backgroundColor:"red",marginLeft:5,marginRight:5}}/>
                          <View style={{borderRadius:50,padding:5,backgroundColor:"green",marginLeft:5,marginRight:5}}/>
                      </View>
                  </View>
                  <TouchableOpacity
                      onPress={() => setCount(3)}
                      style={{padding:10,backgroundColor:"#062FFF",flex:1,borderRadius:50}}>
                      <Text style={{textAlign:"center",color:"white"}}>Next</Text>
                  </TouchableOpacity>
              </View>
          </View>)
      else
          return(
          <View style={{justifyContent:"center" ,width:ScreenWidth,backgroundColor:"white",height:ScreenHeight}}>
            <Loader loading={loading} />
              <Image 
                  source={require('../../../assets/Demo3.png')}
                  style={{marginLeft:50}}
                />
              <Text style={{fontSize:15,textAlign:"center",marginTop:20,fontSize:30,color:"grey",fontWeight:"500",width:"80%",marginLeft:"auto",marginRight:"auto"}}>Earn daily rewards.</Text>
              <View style={{flexDirection:"row",position:"absolute",bottom:30,width:"90%",left:30}}>
                  <View style={{flex:1}}>
                      <View style={{flexDirection:"row",position:"relative",top:10}}>
                          <View style={{borderRadius:50,padding:5,backgroundColor:"green",marginLeft:5,marginRight:5}}/>
                          <View style={{borderRadius:50,padding:5,backgroundColor:"green",marginLeft:5,marginRight:5}}/>
                          <View style={{borderRadius:50,padding:5,backgroundColor:"red",marginLeft:5,marginRight:5}}/>
                      </View>
                  </View>
                  <TouchableOpacity
                      onPress={async () => {
                        AsyncStorage.setItem("userVisitedDemo", JSON.stringify(true))
                          .then((res) => {console.log("data saved successfully"+res)})
                          .catch(err => console.log(err));
                        props.navigation.replace("Auth")
                      }}
                      style={{padding:10,backgroundColor:"#062FFF",flex:1,borderRadius:50}}>
                      <Text style={{textAlign:"center",color:"white"}}>Start</Text>
                  </TouchableOpacity>
              </View>
          </View>)
    }
    else if(AsyncStorage.getItem('userVisitedDemo') !== "true")
    {
      props.navigation.replace("Auth");
    }
    
    
}
//1st
//#FC8019
//2nd
//#ff826a
//3rd
//#f9b765
//final
//#062FFF
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
  export default connect(mapStateToProps, {getItems,getLocation,updatedCart,getHomescreenData,getUserAddress,getAllProducts,getCurrency,getDeliveryData, getUserData, getNotifyByData})(DemoScreen);

const styles = StyleSheet.create({
  spinnerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
})