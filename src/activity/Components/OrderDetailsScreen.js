import React, {useState,useEffect} from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import {connect} from "react-redux";
import {getItems,getLocation,updatedCart,getHomescreenData} from "../../actions/itemsAction.js";
const OrderDetailsScreen = (props) => {
    var [itemsArray,changeItemsArray] = useState(props.route.params.data);
  
    return (
        <ScrollView>	
            {itemsArray && itemsArray.map((item, i) => (
                <View key={i} style={{flexDirection: 'row', backgroundColor: '#fff', marginBottom: 10,marginTop: 10, height: 120,width:"95%",marginLeft:"auto",marginRight:"auto"}}>
                    <View style={{flexDirection: 'row', flexGrow: 1, flexShrink: 1, alignSelf: 'center'}}>
                        <TouchableOpacity onPress={() => {/*this.props.navigation.navigate('ProductDetails', {productDetails: item})*/}} style={{padding: 10}}>
                            <Image source={{uri:  item.varient_image}} style={[styles.centerElement, {height: 60, width: 60, backgroundColor: '#eeeeee'}]} />
                        </TouchableOpacity>
                        <View style={{flexGrow: 1, flexShrink: 1, alignSelf: 'center'}}>
                            <Text numberOfLines={1} style={{fontSize: 15}}>{item.product_name}</Text>
                            <Text numberOfLines={1} style={{color: '#8f8f8f'}}>{item.description ? item.description : ''}</Text>
                            <Text numberOfLines={1} style={{color: '#333333'}}>Quantity :- {item.quantity}{item.unit}</Text>
                            <Text numberOfLines={1} style={{color: '#333333', marginBottom: 10}}>{props.item.currency_sign}{item.quantity * item.price}</Text>
                        </View>           
                    </View>
                </View>
            ))}
        </ScrollView>
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
  export default connect(mapStateToProps, {getItems,getLocation,updatedCart,getHomescreenData})(OrderDetailsScreen);

  const styles = StyleSheet.create({
    container:{
      flex:1,
      backgroundColor:'#F7F4F6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textStyles:{
      marginTop: 10,
      marginBottom: 10,
      marginLeft: 7,
      alignItems: 'flex-start',
      textAlign: 'left',
      padding:10,
      borderRadius: 7,
      fontSize: 23,
    },
    items:{
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemstext:{
      fontSize: 20,
      textAlign: 'center',
      marginBottom: 16,
    },
    noitemstext:{
      color: '#A8A5A7',
      margin: 20,
      textAlign: 'center',
    },
    rechargebutton: {
      backgroundColor: '#062FFF',
      borderWidth: 0,
      color: '#FFFFFF',
      borderColor: '#7DE24E',
      height: 40,
      alignItems: 'center',
      borderRadius: 25,
      marginLeft: 35,
      marginRight: 35,
      top: 100,
      marginBottom: 25,
      width: 200,
    },
    textRecharge: {
      color: '#FFFFFF',
      paddingVertical: 10,
      fontSize: 16,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    trendingParentView: {
      width: 30,
      height: 30,
      margin: 5,
      backgroundColor: '#062FFF',
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      borderRadius: 7,
    },
  });