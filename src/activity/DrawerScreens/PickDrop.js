
import { StyleSheet, View, Text, Dimensions, ToastAndroid } from 'react-native';
import MapView, { Marker, Polyline }  from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons'; 
import * as Location  from 'expo-location'
import {connect} from "react-redux";
import {getItems,getLocation,updatedCart,getHomescreenData,getAllProducts, getCurrency,getDeliveryData,getUserData} from "../../actions/itemsAction.js";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {useState} from "react";
import React, { useEffect, useRef } from 'react';
var user_id = "0";
import { BackHandler } from 'react-native';

const PickDrop = (props) => {
  user_id = props.item.userdata.user_id;
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

  function handleBackButtonClick() {
    props.navigation.navigate("Home")
    return true;
  }


  const ref = useRef();

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    ref.current?.setAddressText('');
  }, []);

    const lat1 = 28.7041;
    const lng2 = 77.1025;
    const [region, setRegion] = useState({
        latitude: lat1,
        longitude: lng2,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        
      });
     
      const tokyoRegion = {
        latitude: 35.6762,
        longitude: 139.6503,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      const chibaRegion = {
        latitude: 35.6074,
        longitude: 140.1065,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
     return (
       user_id!=0?
        <View style={{flexDirection:'column',flex:1}}>
            <View style={{marginBottom:50}}>
            <GooglePlacesAutocomplete
      ref={ref}
      placeholder='Enter Pick up location'
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: 'AIzaSyCTsuo3QSNdQmKWM3KUGQpYo-BrSWvNRjQ',
        language: 'en',
      }}
    />
</View>
<View style={{marginBottom:50}}>
<GooglePlacesAutocomplete
      ref={ref}
      placeholder='Enter Drop Location'
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: 'AIzaSyCTsuo3QSNdQmKWM3KUGQpYo-BrSWvNRjQ',
        language: 'en',
      }}
    />
</View>
             <MapView 
             style={styles.map} 
                  showsUserLocation={true}
            initialRegion={tokyoRegion}>

  
    </MapView>
        </View>
        :
        <View>
          <Text></Text>
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
  export default connect(mapStateToProps, {getItems,getLocation,updatedCart,getHomescreenData,getAllProducts,getCurrency,getDeliveryData,getUserData})(PickDrop);
  
const styles = StyleSheet.create({
    map: {
       flex:1
    },
    overlay: {
        position: 'absolute',
        bottom: 50,
        backgroundColor: 'rgba(255, 255, 255, 1)',
      },
    heading: {
        alignSelf: 'center',
        paddingTop: 20,
        marginBottom: 10,
        fontSize: 24
    },
});