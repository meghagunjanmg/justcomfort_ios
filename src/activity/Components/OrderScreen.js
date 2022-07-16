import * as React from 'react';
import {useState,useEffect} from "react";
import { View, Text , TouchableOpacity, ScrollView,ActivityIndicator, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import {StyleSheet} from 'react-native';
import {connect} from "react-redux";
import {getUserOrders,getUserPastOrders} from "../../actions/itemsAction";



const OrderScreen = (props) => {
  const layout = useWindowDimensions();
  const [userOrders,changeUserOrders] = useState(props.item.userOrderData);
  const [userPastOrders,changeUserPastOrders] = useState(props.item.userPastOrderData)
  const [index, setIndex] = useState(0);
  const [loading,setloading] = useState(true);
  const [checkOrderBlank,setCheckOrderBlank] = useState(false);
  const [checkPastOrderBlank,setCheckPastOrderBlank] = useState(false);
  const [routes] = useState([
    { key: 'first', title: 'Pending Order' },
    { key: 'second', title: 'Past Order' },
  ]);

   useEffect(() => {
     if(props.item.userdata.user_id != null)
     {
        _getOrdersData();
     }
     else
      props.navigation.replace("Auth");
   }, [])
   const _getOrdersData = async () => {
      var formdata = new FormData();
      formdata.append("user_id", props.item.userdata.user_id);

      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };
  
      await fetch("http://justcomfort.umbeo.com/admin/api/ongoing_orders", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if(Array.isArray(result) && result.length){
            props.getUserOrders(result);
            changeUserOrders(result);
            setCheckOrderBlank(false);
          }else{
            setCheckOrderBlank(true);
            console.log("In else condition...");
          }
          // console.log(result);
        })
        .catch(error => console.log('error', error));
      
      await fetch("http://justcomfort.umbeo.com/admin/api/completed_orders", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result.length);
        console.log(result);
        console.log("Length of an array...");
        if(Array.isArray(result) && result.length > 1){
          props.getUserPastOrders(result);
          changeUserPastOrders(result);
          setloading(false);
          setCheckOrderBlank(false);
        }else{
          console.log("<< In else condition completed ...");
          setloading(false);
          setCheckPastOrderBlank(true);
        }
       
      })
      .catch(error => console.log('error', error));
   }
    
  
  const FirstRoute = () => {
    console.log(checkOrderBlank);
    console.log("check order status");
    if (loading){
      // console.log("if statement called");
      return (
        <View style={styles.spinnerView}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }else if(!checkOrderBlank){
      return(<ScrollView vertical={true}
        showsVerticalScrollIndicator ={false}
        showsHorizontalScrollIndicator={false} >
        {userOrders.map((order) => {
        return(
          <View
          key={order.cart_id} 
          style={styles.topbar} >
            <View style={{marginTop:10,marginBottom:10}}>
              <Text style={{color:"#062FFF",}}>Payment method:- {order.payment_method}</Text>
              <Text style={{color:"#7f7f7f"}}>Estimated Delivery:- {order.delivery_date}</Text>
            </View>
            <View style={{flexDirection:"row",borderBottomColor:"grey",borderBottomWidth:2,borderTopColor:"grey",borderTopWidth:2}}>
              <View style={{borderRightColor:"grey",width:"50%",borderRightWidth:3,padding:6}}>
                <Text style={{color:"#7f7f7f",fontWeight:"bold"}}>Order Id:- {order.cart_id}</Text>
                <Text style={{color:"#7f7f7f"}}>Placed on:- {order.data[0].order_date}</Text>
                <Text style={{color:"#7f7f7f"}}>Time:- {order.data[0].order_date}</Text>
                <Text style={{color:"#7f7f7f"}}>Item Qty:- {order.data[0].quantity}</Text>
              </View>
  
              <View style={{padding:10,width:"50%",alignItems:"center"}}>
                <Text style={{color:"#062FFF"}}>Order Status</Text>
                <Text style={{color:"#7f7f7f",fontWeight:"bold"}}>{order.order_status}</Text>
              </View>
            </View>
  
            <View style={{flexDirection:"row",marginTop:10,marginBottom:10,width:"95%",marginLeft:"auto",marginRight:"auto"}}>
              <View style={{marginTop:10,marginBottom:10,width:"50%"}}>
                <Text style={{color:"#7f7f7f"}}>Order Amount:-</Text>
                <Text style={{color:"#7f7f7f"}}>Delivery Charges:-</Text>
                <Text style={{color:"#7f7f7f",marginTop:2}}>Total Payable Amount:-</Text>
              </View>
              <View style={{marginTop:10,marginBottom:10,alignItems:"flex-end",width:"50%"}}>
                <Text style={{color:"#7f7f7f"}}>{props.item.currency_sign}{order.price - order.del_charge}</Text>
                <Text style={{color:"#7f7f7f",borderBottomColor:"grey",borderBottomWidth:1}}>{props.item.currency_sign}{order.del_charge}</Text>
                <Text style={{color:"#7f7f7f",marginTop:2}}>{props.item.currency_sign}{order.price}</Text>
              </View>
            </View>
  
            <View style={{flexDirection:"row",marginBottom:10}}>
              {order.order_status !== "Cancelled"?
              <TouchableOpacity 
                onPress={() => props.navigation.navigate("OrderCancelPageScreen", {screen: "OrderCancelPageScreen", params: {data:order.data}})} 
                style={{backgroundColor:"red",width: "48%",padding:10,borderRadius:50,alignItems:"center",marginRight:10}}>
                <Text style={{color:"white"}}>Cancel</Text>
              </TouchableOpacity>:
              <TouchableOpacity 
                onPress={() => props.navigation.navigate("OrderCancelPageScreen", {screen: "OrderCancelPageScreen", params: {data:order.data}})} 
                style={{backgroundColor:"green",width: "48%",padding:10,borderRadius:50,alignItems:"center",marginRight:10}}>
                <Text style={{color:"white"}}>Reorder</Text>
              </TouchableOpacity>}
  
              <TouchableOpacity 
                onPress={() => props.navigation.navigate("OrderDetailsScreen", {screen: "OrderDetailsScreen", params: {data:order.data}})} 
                style={{backgroundColor:"#062FFF",width: "48%",padding:10,borderRadius:50,alignItems:"center"}}>
                <Text style={{color:"white"}}>Order Details</Text>
              </TouchableOpacity>
            </View>
  
          </View>
        );
        
      })}
      </ScrollView>
      );
    }else{
      return(
        <View style={styles.orderDetailsScreen}>
          <Text>No Pending Order Details Available</Text>
        </View>
      );
    }
    
  }
  
  const SecondRoute = () => {
    console.log("user past orders are :- "+userPastOrders)
    console.log("user past orders are is available:- "+ checkPastOrderBlank);
    if (loading){
      return (
        <View style={styles.spinnerView}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    else if(!checkPastOrderBlank){
      return(<ScrollView vertical={true}
        showsVerticalScrollIndicator ={false}
        showsHorizontalScrollIndicator={false}
        style={{opacity:0.5}} >
        {userPastOrders.map((order) => {
        return(
          <View
          key={order.cart_id} 
          style={styles.topbar} >
            <View style={{marginTop:10,marginBottom:10}}>
              <Text style={{color:"#062FFF",}}>Payment method:- {order.payment_method}</Text>
              <Text style={{color:"#7f7f7f"}}>Estimated Delivery:- {order.delivery_date}</Text>
            </View>
            <View style={{flexDirection:"row",borderBottomColor:"grey",borderBottomWidth:2,borderTopColor:"grey",borderTopWidth:2}}>
              <View style={{borderRightColor:"grey",width:"50%",borderRightWidth:3,padding:6}}>
                <Text style={{color:"#7f7f7f",fontWeight:"bold"}}>Order Id:- {order.cart_id}</Text>
                <Text style={{color:"#7f7f7f"}}>Placed on:- {order.data[0].order_date}</Text>
                <Text style={{color:"#7f7f7f"}}>Time:- {order.data[0].order_date}</Text>
                <Text style={{color:"#7f7f7f"}}>Item Qty:- {order.data[0].quantity}</Text>
              </View>
  
              <View style={{padding:10,width:"50%",alignItems:"center"}}>
                <Text style={{color:"#062FFF"}}>Order Status</Text>
                <Text style={{color:"#7f7f7f",fontWeight:"bold"}}>{order.order_status}</Text>
              </View>
            </View>
  
            <View style={{flexDirection:"row",marginTop:10,marginBottom:10,width:"95%",marginLeft:"auto",marginRight:"auto"}}>
              <View style={{marginTop:10,marginBottom:10,width:"50%"}}>
                <Text style={{color:"#7f7f7f"}}>Order Amount:-</Text>
                <Text style={{color:"#7f7f7f"}}>Delivery Charges:-</Text>
                <Text style={{color:"#7f7f7f",marginTop:2}}>Total Payable Amount:-</Text>
              </View>
              <View style={{marginTop:10,marginBottom:10,alignItems:"flex-end",width:"50%"}}>
                <Text style={{color:"#7f7f7f"}}>{props.item.currency_sign}{order.price-order.del_charge}</Text>
                <Text style={{color:"#7f7f7f",borderBottomColor:"grey",borderBottomWidth:1}}>{props.item.currency_sign}{order.del_charge}</Text>
                <Text style={{color:"#7f7f7f",marginTop:2}}>{props.item.currency_sign}{order.price}</Text>
              </View>
            </View>
  
            <View style={{flexDirection:"row",marginBottom:10}}>
              <TouchableOpacity 
                onPress={() => props.navigation.navigate("OrderDetailsScreen", {screen: "OrderDetailsScreen", params: {data:order.data}})} 
                style={{backgroundColor:"#062FFF",width: "95%",padding:10,borderRadius:50,alignItems:"center"}}>
                <Text style={{color:"white"}}>Order Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
      </ScrollView>
      );
    }else{
      return(
        <View style={styles.orderDetailsScreen}>
          <Text>No Past Order Details Available</Text>
        </View>
      );
    }
  }
  
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'red',borderBottomColor:"red",borderBottomWidth:2 }}
      style={{ backgroundColor: '#062FFF'}}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
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
export default connect(mapStateToProps, {getUserOrders,getUserPastOrders})(OrderScreen);
const styles = StyleSheet.create({
  topbar: {
    marginTop: 10,
    marginBottom:10,
    marginLeft:"auto",
    marginRight:"auto",
    width:"95%", 
    height: "auto" ,
    backgroundColor:"white",
    padding:10,
    borderRadius:5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,  
    elevation: 10,
    // flex:1,
  },
  sideBox:{
    width: "50%",
    // flex:1

  },spinnerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  orderDetailsScreen:{
    width:"95%",
    elevation:10,
    marginLeft:"auto",
    marginRight:"auto",
    marginTop:30,
    marginBottom:20,
    padding:5,
    paddingTop:20,
    paddingBottom:30, 
    backgroundColor:"white",
    borderRadius:10
  }
});