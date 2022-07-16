import React, {useState,useEffect} from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import {connect} from "react-redux";
import {getUserOrders,getUserPastOrders} from "../../actions/itemsAction.js";

const OrderCancelPage = (props) => {
    var[userOrders,changeUserOrders] = useState(props.item.userOrderData)
    var[orderData,changeOrderData] = useState(props.route.params.data);
    var[cancelReasons,changeCancelReason] = useState([]);
    useEffect(() => {
        
        
        _getCancellingReason();
        
      }, [])

    const _getCancellingReason= () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
          fetch("http://justcomfort.umbeo.com/admin/api/cancelling_reasons", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                changeCancelReason(result.data);
            })
            .catch(error => console.log('error', error));
    }

    const handleCancelOrderRequest = (reason) => {
        var indexInArray = null;
        console.log("userOrder contains:-"+userOrders);
        console.log("orderData contains:-"+orderData);
        for(var i=0;i<userOrders.length;i++)
        // console.log(`${userOrders[i].cart_id} === ${orderData[0].order_cart_id}`)
            if(userOrders[i].cart_id === orderData[0].order_cart_id)
                indexInArray = [i];
        console.log("Index is:-"+ indexInArray)
        var canceledOrder = userOrders[indexInArray];
        var tempArray = userOrders;
        tempArray.splice(indexInArray, 1);
        canceledOrder.order_status = "Cancelled";
        props.getUserOrders(tempArray);
        var tempArray2 = props.item.userPastOrderData;
        tempArray2.push(canceledOrder);
        props.getUserPastOrders(tempArray2);

        var formdata = new FormData();
        formdata.append("cart_id", orderData[0].order_cart_id);
        formdata.append("reason", reason);

        var requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };

        fetch("http://justcomfort.umbeo.com/admin/api/delete_order", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));


        props.navigation.navigate("OrderScreen")
        console.log("Order Cancelled");
    }
    return(<ScrollView>
        {cancelReasons.map(data => {
            return(
                <TouchableOpacity 
                    key={data.res_id}
                    onPress={() => handleCancelOrderRequest(data.reason)} 
                    style={{backgroundColor:"#e76a0a",width: "95%",marginRight:"auto",marginLeft:"auto",marginTop:10,padding:10,borderRadius:50,alignItems:"center"}}>
                    <Text style={{color:"white"}}>{data.reason}</Text>
                </TouchableOpacity>
            );
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
  export default connect(mapStateToProps, {getUserOrders,getUserPastOrders})(OrderCancelPage);