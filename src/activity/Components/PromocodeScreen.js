import React, {useState, useEffect} from "react";
import {StyleSheet, 
  View,
  Text, 
  SafeAreaView, 
  ScrollView, 
  TextInput,
  Image, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { EvilIcons, FontAwesome } from '@expo/vector-icons'; 
import SegmentedControlTab from 'react-native-segmented-control-tab';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from "react-redux";
import {getCouponDiscount} from "../../actions/itemsAction.js";
import { MaterialIcons } from '@expo/vector-icons';
import Loader from "./Loader.js";
import Storage from "../Storage.js";


const PromocodeScreen = (props) => {
    var [promocodeData,setPromocodeData] = useState([]);
    var cartID = "SZFA4895";
    var [loading,setLoading] = useState(false);
    console.log(props.route.params.total_price);
    useEffect(() => {
        setLoading(true);
        var formdata = new FormData();
        formdata.append("total_price", props.route.params.total_price);

        var requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };

        fetch("http://justcomfort.umbeo.com/admin/api/couponlist", requestOptions)
          .then(response => response.json())
          .then(async result => {
            if(result.status!=0)
            {  console.log(result);
              await setPromocodeData(result.data);
              setLoading(false);
            }
            else{
              setLoading(false);
              Alert.alert(
                "Sorry",
                "No promo code available",
                [
                  {
                    text: "OK",
                    onPress: () =>  props.navigation.navigate("Cart")

                  },
                ]
              );
            }
            })
          .catch(error => {
              console.log('error', error)
              setLoading(false);
        });
    }, [])

    const handleSubmitCupon = (coupon_code) =>{
        setLoading(true);
        console.log("Called")
        var formdata = new FormData();
        formdata.append("coupon_code", coupon_code);
        formdata.append("user_id", props.route.params.user_id);
        formdata.append("total_price", props.route.params.total_price);

        var requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };

        fetch("http://justcomfort.umbeo.com/admin/api/apply_coupon", requestOptions)
          .then(response => response.json())
          .then(async result => {
              var data = {discount:result.coupon_discount,couponName:coupon_code,couponApplied:true};
                await props.getCouponDiscount({discount:result.coupon_discount,couponName:coupon_code,couponApplied:true})
                setLoading(false);
                props.navigation.push("CartScreen");
            })
          .catch(error =>{ 
            console.log('error', error)
            setLoading(false);
            });
          



    }
    return(
        <ScrollView>
            <Loader loading={loading}/>
            {promocodeData.map(code => {
                return(
                <View
                 key={code.coupon_id}
                 style={{flexDirection:"row",width:"95%",marginLeft:"auto",marginRight:"auto",marginTop:10,marginBottom:5,backgroundColor:"white",padding: 10,elevation:10,borderRadius:10}}>
                    <View style={{flex:1}}>
                        <Text style={{color:"black",fontSize:20,fontWeight:"bold",marginBottom:10}}>{code.coupon_name}</Text>
                        <Text style={{color:"grey"}}>{code.coupon_description}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={{borderWidth:1,borderColor:"grey",borderRadius:10,padding:5,textAlign:"center",marginBottom:10}}>{code.coupon_code}</Text>
                        <TouchableOpacity 
                            onPress={() => 
                              handleSubmitCupon(code.coupon_code)
                            }
                            style={{padding:7,backgroundColor:"orange",borderRadius:10}}>
                            <Text style={{textAlign:"center",color:"white"}}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>)
            })}
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
  export default connect(mapStateToProps,{getCouponDiscount})(PromocodeScreen);