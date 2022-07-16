import React from 'react';
import { StyleSheet, View, Text, Dimensions, ToastAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons'; 
import * as Location  from 'expo-location'
import {connect} from "react-redux";
import {getItems,getLocation,updatedCart,getHomescreenData,getAllProducts, getCurrency,getDeliveryData,getUserData} from "../actions/itemsAction.js";

import {useState,useEffect} from "react";

import {_storeData, _retrieveData} from "./Storage";

const MapComponent = (props,navigation) => {
    console.log(props.route.params.latitude)
    const lat1 = parseFloat(props.route.params.latitude);
    const lng2 = parseFloat(props.route.params.longitude);
    const [region, setRegion] = useState({
        latitude: lat1,
        longitude: lng2,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        
      });
     

  const remove =async (key) =>{
    try {
        await AsyncStorage.removeItem(key);
        return true;
    }
    catch(exception) {
        return false;
    }
  }

  remove("lat")
  remove("lng")
const lat = region.latitude;
const lng = region.longitude;
      _storeData("lat",lat+"");
      _storeData("lng",lng+"");

     return (
        <View style={styles.map}>
            <MapView style={styles.map}
            showsUserLocation={true}
            onRegionChangeComplete={(region) => {
                setRegion(region)
            }
        }
            onMarkerPress={()=>  props.navigation.replace('DrawerNavigationRoutes', {screen: "Home"})}
             >
            <Marker  
            coordinate={region} title="My location" >
             </Marker>
            </MapView>
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
  export default connect(mapStateToProps, {getItems,getLocation,updatedCart,getHomescreenData,getAllProducts,getCurrency,getDeliveryData,getUserData})(MapComponent);
  
const styles = StyleSheet.create({
    map: {
       flex:1
    },
    heading: {
        alignSelf: 'center',
        paddingTop: 20,
        marginBottom: 10,
        fontSize: 24
    },
});