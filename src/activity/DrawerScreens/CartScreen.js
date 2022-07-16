import React, {useState,useEffect} from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert,TextInput,Modal } from 'react-native';
import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import {connect} from "react-redux";
import { EvilIcons, FontAwesome } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-community/async-storage';

import {getItems,getLocation,updatedCart,getHomescreenData,getOrderDetailsData,getUserAddress} from "../../actions/itemsAction.js";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from "react-native-simple-radio-button";
import Constants from '../Components/Constants';
///import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-simple-toast';
import { sub } from 'react-native-reanimated';
var subT=0;


const Cart = (props) => {
  var [successModal, setSuccessModal] = useState(false);

  var [val,chanvalue] = useState();
  var [cartId, setCartId] = useState("");
  var [couponCodeData,setCouponCodeData] = useState(props.item.couponDiscount);
  var [rewardsValue,setRewardsValue] = useState(0);
  var [rewardsButtonShow,setRewardsButtonShow] = useState(true);
  var [cartItemsIsLoading,changeCartItemsIsLoading] = useState(false);
  var [cartItemsArray,changeCartItemsArray] = useState(props.item.cartItems);
  var [showDeliverInsInput,setShowDeliverInsInput] = useState(false);
  const [date, setDate] = useState(new Date());
  const [finalDate,setFinalDate] = useState("");
  const [finalTime,setFinalTime] = useState("");
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  var [value,changeRadioValue] = useState("08:00 - 10:00");
  var [newCartArray,changeNewCartArray] = useState([]);
  var [deliveryInstruction,setDeliveryInstruction] = useState("");
  var [addresss,setAddress] = useState("");
  var [showDeliveryInstructionButton,setShowDeliveryInstructionButton] = useState(true);
  var [showGreenTick,setShowGreenTick] = useState(false);
  var [rewardsv,setRewardsV] = useState("");
  var [rewardsval,setRewardsVal] = useState("");


  var [s,setS] = useState(0);


  var [radio_props,changeRadioProps] = useState([
      // {label: '08:00 - 10:00', value: "08:00 - 10:00" },
      // {label: '10:00 - 13:00', value: "10:00 - 13:00" },
      // {label: '13:00 - 16:00', value: "13:00 - 16:00" },
      // {label: '16:00 - 19:00', value: "16:00 - 19:00" },
      // {label: '19:00 - 22:00', value: "19:00 - 22:00" }
  ]);
  useEffect(() => {
  
       // Update the user data
       console.log("props.item.top_selling");
       console.log(props.item.homepageData.recent_selling[0].store_id);
       var currentDate = new Date();
       var choosenDate=`${currentDate.getFullYear()}-${('0' + (currentDate.getMonth()+1)).slice(-2)}-${('0' + (currentDate.getDate())).slice(-2)}`;
       _getTimings(choosenDate);
       _getUserDetails();
   
       getrewardvalue();


   
       if (rewardsValue*rewardsv>=subtotalPrice()) {
              console.log("Reward amount **")
              setRewardsValue(subtotalPrice())
            } else {
             //console.log("Reward amount ")
             setRewardsValue(rewardsValue*rewardsv)
            }
     }, [])
     const _getCartOrderID = async(couponCodeData, data, rewardsValue) => {
      var tempArray=[];
  
      for(var i=0;i<cartItemsArray.length;i++)
      {
          var temp = {
              qty: cartItemsArray[i].qty,
              varient_id: cartItemsArray[i].varient_id,
              product_image: cartItemsArray[i].product_image
          }
          tempArray.push(temp);
      }
    
      let dataToSend = {
          time_slot: data.orderTime, 
          delivery_date: data.orderDate,
          store_id:  props.item.homepageData.recent_selling[0].store_id,
          user_id: props.item.userdata.user_id,
          delivery_instructions: data.del_ins,
          order_array: JSON.stringify(tempArray),
          rewards:rewardsValue,
          coupon_code:couponCodeData
      };

      //console.error(dataToSend)

      let formBody = [];
      for (let key in dataToSend) {
          let encodedKey = encodeURIComponent(key);
          let encodedValue = encodeURIComponent(dataToSend[key]);
          formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      var requestOptions = {
        method: 'POST',
        body: formBody,
        redirect: 'follow',
        headers: 
          {
              //Header Defination
              'Content-Type':
              'application/x-www-form-urlencoded;charset=UTF-8',
          }
      
      };

      console.log(requestOptions);
      fetch("http://justcomfort.umbeo.com/admin/api/make_an_order", requestOptions)
        .then(response => response.json())
        .then(async (result) => {
          if(result.status == 0){
              Alert.alert(result.message);
              Alert.alert(
                  "Please select any address before checkout.",
                  result.message,
                  [
                    { text: "OK", onPress: () => props.navigation.replace("CartScreen") }
                  ]
              );
          }else if(result.status == 1){
              await setCartId(result.data.cart_id);
          }
        })
        .catch(error => console.log('error comming from Make_An_order_Api', error));
  };

 const makeAddOrderRequest= async(couponCodeData, data, rewardsValue) =>{
  _getCartOrderID(couponCodeData, data, rewardsValue);
  var formdata = new FormData();
  formdata.append("user_id", props.item.userdata.user_id);
  formdata.append("payment_status", "success");
  formdata.append("cart_id", cartId);
  formdata.append("payment_method", "wallet");
  formdata.append("wallet","yes" );

  var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };

  fetch("http://justcomfort.umbeo.com/admin/api/checkout", requestOptions)
    .then(response => response.json())
    .then(result => {
       console.log("The checkout formdata is:-"+JSON.stringify(formdata));
       console.log('checkout ', result)

      if(result.status == "2" || result.status == "1"){
          console.log('checkout ', result)
        var temparray=[];
        props.updatedCart(temparray);
        setSuccessModal(!successModal);
        /*Alert.alert(
          "Success",
          result.message,
          [
            { text: "OK", onPress: () => props.navigation.replace("DrawerNavigationRoutes") }
          ]
        );*/
      }
    })
    .catch(error => {
        console.log('error', error)
        Alert.alert(
          "Order Not Placed, Please try again later!!",
          result.message,
          [
            { text: "OK", onPress: async () => {
                await props.getCouponData({
                  couponName:null,
                  discount:0,
                  couponApplied:false
                  })
                await console.log(props.item.couponDiscount)
                props.navigation.replace("DrawerNavigationRoutes")
              } }
          ]
        );
      });
}
const successOrder = () => {
  setSuccessModal(!successModal);
  props.navigation.reset({
      index: 0,
      routes: [{name: 'DrawerNavigationRoutes'}],
    });
}

  const getrewardvalue = () => {

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch("http://justcomfort.umbeo.com/admin/api/rewardvalues", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === '1'){
         setRewardsV(result.data.value)
        
        }else{
          console.log('Please check your API.. ' + result.message);
        }
      })
      .catch(error => console.log('error', error));
    }

  const userReward = () => {

    var formdata1 = new FormData();
    formdata1.append("user_id", props.item.userdata.user_id);
    formdata1.append("cart_id", props.item.storeId);

    var requestOptions = {
      method: 'POST',
      body: formdata1,
      redirect: 'follow'
    };
    fetch("http://justcomfort.umbeo.com/admin/api/usereward", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === '1'){
         setRewardsV(result.data.value)
       
        }else{
          console.log('Please check your API.. ' + result.message);
        }
      })
      .catch(error => console.log('error', error));
  }


  const _getUserDetails = async() => {
    const val = await AsyncStorage.getItem('autopay');
    console.error(val);
    chanvalue(val)

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
            var item;
            result.data.forEach(
              function(item){
                console.log(item);
                if(item.select_status === 1)
          {
            var ad = (item.house_no+","+item.society+","+item.city+","+item.state+","+item.pincode).replace("undefined","").replace(",,",",")
            setAddress(""+ad)
          }
               }
            )
          }else{
            setErrortext(result.message);
            console.log('Please check your API.. ' + result.message);
          }
        })
        .catch(error => console.log('error', error));
  }

  const deleteHandler = (partOf,desc,index) => {
		Alert.alert(
			'Are you sure you want to delete this item from your cart?',
			'',
			[
				{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
				{text: 'Delete', onPress: () => {
					let updatedCart = cartItemsArray; /* Clone it first */
          updatedCart[index].qty=0;
          props.updatedCart(updatedCart,partOf,desc);
					updatedCart.splice(index, 1); /* Remove item from the cloned cart state */
					//this.setState(updatedCart); /* Update the state */
          changeCartItemsArray(updatedCart); // set new state
          props.updatedCart(updatedCart,partOf,desc);
          console.log(`The data in cart is :- ${cartItemsArray}`);
				}},
			],
			{ cancelable: false }
		);
	}
	
	const quantityHandlerForCart = (action, partOf, desc, indexInCart) => {
    //1-> we have to check the codition of more or less
    //2-> we need to find weather the item is already in the cart
    //3-> if yes increment the quantity in cart as well as in parOf like trending item or what as well as deceare the total quantity in partOf
    //4-> if not-> add the item to cart and increase the quantity demanded in PartOf
    
    //part 1
    console.log("Quantity handler called")
    if(action == 'more')
    {
      console.log(`The Action is More`);
      //Updating the Cart's qty of that item
      console.log(`Item ${cartItemsArray[indexInCart].description} already present with qty = ${cartItemsArray[indexInCart].qty}`)
      var updateQty = cartItemsArray[indexInCart].qty;
      updateQty= updateQty + 1;
      var tempArray = cartItemsArray;
      tempArray[indexInCart].qty = updateQty; 
      changeCartItemsArray(tempArray);
      props.updatedCart(cartItemsArray,partOf,desc);
      console.log(`New Qty is = ${cartItemsArray[indexInCart].qty}`)

		} 
    else if(action == 'less')
    {
      console.log(`The Action is Less`);
      //Updating the Cart's qty of that item
      // console.log(`Item ${cartItemsArray[indexInCart].description} already present with qty = ${cartItemsArray[indexInCart].qty}`)
      var updateQty = cartItemsArray[indexInCart].qty;
      updateQty= updateQty - 1;
      var tempArray = cartItemsArray;
      tempArray[indexInCart].qty = updateQty; 
      if(tempArray[indexInCart].qty === 0)
      {
        tempArray.splice(indexInCart, 1);
      } 
      changeCartItemsArray(tempArray);
      props.updatedCart(cartItemsArray,partOf,desc);
      // console.log(`New Qty is = ${cartItemsArray[indexInCart].qty}`)
    }
  }
	
	const subtotalPrice = () => {
		// const { cartItems } = cartItems;
		if(cartItemsArray){
			return cartItemsArray.reduce((sum, item) => sum + (item.qty * item.price), 0 );
		}
		return 0;
	}
  const TaxesPrice = () => {
		// const { cartItems } = cartItems;
		if(cartItemsArray){
			return cartItemsArray.reduce((sum, item) => sum + (item.qty * ((item.gst*item.price)/100+(item.hst*item.price)/100)), 0 );
		}
		return 0;
	}
	
    const navigation = props.navigation;
		const styles = StyleSheet.create({
			centerElement: {justifyContent: 'center', alignItems: 'center'},
		});
		
		// const { cartItems, cartItemsIsLoading, selectAll } = this.state;
		const _getTimings = async (choosenDate) => {
      console.log("the date is:-"+choosenDate);
      var formdata = new FormData();
      formdata.append("selected_date", choosenDate);
      setFinalDate(choosenDate);
      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };
      
      await fetch("http://justcomfort.umbeo.com/admin/api/timeslot", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if(result.status == 0){
            //Toast.show(result.message + " Please select future date for delivery date.");
          }else{
            var tempArray=[];
            result.data.map(time => {
              tempArray.push({label: time, value: time})
              })
            changeRadioValue(tempArray[0].value);
            changeRadioProps(tempArray);
          }
        })
        .catch(error => console.log('error', error));
    }

      const onChange = async (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        await setDate(currentDate);
        console.log("The date returned:-"+currentDate)
        var choosenDate=`${currentDate.getFullYear()}-${('0' + (currentDate.getMonth()+1)).slice(-2)}-${('0' + (currentDate.getDate())).slice(-2)}`;
        console.log("choosen date:-"+choosenDate);
        _getTimings(choosenDate);
      };
  
      const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };
  
      const showDatepicker = () => {
        showMode('date');
      };
  
      const showTimepicker = () => {
        showMode('time');
      };


		return (
      cartItemsArray.length > 0 ?
			<View style={{flex: 1, backgroundColor: '#f6f6f6'}}>
            <Modal
                    animationType="slide"
                    transparent={true}
                    visible={successModal}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setSuccessModal(!successModal);
                    }}
                >
                    <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width:"100%",
        marginLeft:"auto",
        marginRight:"auto",
        height:"100%",
        backgroundColor: '#00000040',

    }}>
                    <View style={{
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }}>
                        <Text style={{
        marginBottom: 15,
        textAlign: "center",
        fontSize:20,
        color:"grey"
    }}>Order Placed!!</Text>
                        <AntDesign name="checkcircleo" size={50} color="#52C829" />
                        <TouchableOpacity
                        style={[{
                          borderRadius: 20,
                          padding: 10,
                          elevation: 2,
                          marginTop: 15,
                          width:120
                      }, {
                        backgroundColor: "#062FFF",
                    }]}
                        onPress={() => successOrder()}
                        >
                        <Text style={ {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </Modal>
				<View style={{flexDirection: 'row', backgroundColor: '#fff', marginBottom: 10}}>
					<View style={[styles.centerElement, {width: 50, height: 50}]}>
						<Ionicons name="ios-cart" size={25} color="#000" />
					</View>
					<View style={[styles.centerElement, {height: 50}]}>
						<Text style={{fontSize: 18, color: '#000'}}>Shopping Cart</Text>
					</View>
				</View>
				{cartItemsIsLoading ? (
					<View style={[styles.centerElement, {height: 300}]}>
						<ActivityIndicator size="large" color="#ef5739" />
					</View>
				) : (
					<ScrollView>	
						{cartItemsArray && cartItemsArray.map((item, i) => {
              var taxtype;
              console.log(item.gst+" "+item.hst)
              if(item.gst==0){
                  taxtype = "H"
              }
              if(item.hst==0){
                taxtype = "G"
            }
              return(
							<View key={i} style={{flexDirection: 'row', backgroundColor: '#fff', marginBottom: 5,width:"95%",marginLeft:"auto",marginRight:"auto",borderRadius:10}}>
								
								<View style={{flex:3}}>
                  <View style={{flexDirection:"row"}}>
								  	<TouchableOpacity onPress={() => {/*this.props.navigation.navigate('ProductDetails', {productDetails: item})*/}} style={{padding: 10,flex: 1,}}>
								  		<Image source={{uri: item.product_image}} style={{height:80,width:80}}/>
								  	</TouchableOpacity>
								  	<View style={{alignSelf: 'center',flex: 3,marginLeft:20}}>
								  		<Text  >{item.product_name}</Text>
                      <Text  >{item.varients[0].quantity} {item.unit}</Text>
								  		<Text  >{item.description ? item.description : ''}</Text>
                      <Text  >${item.qty * item.price} {taxtype}</Text>
                     
								  	</View>
								  </View>
                </View>

                <View style={{flex:1}}>
                  <View style={{position:"absolute",right:20}}>
								  	<TouchableOpacity onPress={() => deleteHandler("",item.description,i)}>
								  		<Text style={{color:"#062FFF",fontSize:20}}>x</Text>
								  	</TouchableOpacity>
								  </View>

                  <View style={{flexDirection:"row",borderColor:"#062FFF",borderWidth:2,borderRadius:5,padding:5,width:80,justifyContent:"flex-end",position:"absolute",bottom:10}}>
                    <TouchableOpacity 
                      onPress={() => quantityHandlerForCart('less',"" ,item.description, i)}
                      style={styles.trendingParentView}>
                      <MaterialIcons name="remove" size={20} color="#062FFF" />
                    </TouchableOpacity>
                    <Text style={{paddingHorizontal: 7, color: '#000000', fontSize: 13}}>{item.qty}</Text>
                    <TouchableOpacity 
                      onPress={() => quantityHandlerForCart('more',"" ,item.description, i)}
                      style={styles.trendingParentView}>
                      <MaterialIcons name="add" size={20} color="#062FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
								
							</View>
						)})}
            <View style={{width:"95%",elevation:10,marginLeft:"auto",marginRight:"auto",marginTop:30,marginBottom:20,padding:5,paddingTop:20,paddingBottom:30, backgroundColor:"white",borderRadius:10}}>
              <View style={{width:"95%",marginLeft:"auto",marginRight:"auto"}}>
                  <Text>Number of Cart Items ( {cartItemsArray.length} )</Text>
                  <View style={{flexDirection:"row",marginTop:7,marginBottom:10,width:"98%",marginLeft:"auto",marginRight:"auto"}}>
                      <View style={{marginTop:10,marginBottom:10,width:"50%"}}>
                        <Text style={{color:"black"}}>Order Amount</Text>
                        <Text style={{color:"black"}}>Rewards Applied</Text>
                        <Text style={{color:"black"}}>Coupon Discount</Text>
                        <Text style={{color:"black"}}>Taxes</Text>
                        <Text style={{color:"black"}}>Delivery Charges</Text>
                        <Text style={{color:"black",marginTop:2}}>Total Payable Amount</Text>
                      </View>
                      <View style={{marginTop:10,marginBottom:10,alignItems:"flex-end",width:"50%"}}>
                        <Text style={{color:"#7f7f7f"}}>{props.item.currency_sign}{subtotalPrice().toFixed(2)}</Text>
                        <Text style={{color:"#7f7f7f"}}>{props.item.currency_sign}{rewardsValue}</Text>
                        <Text style={{color:"#7f7f7f"}}>{props.item.currency_sign}{couponCodeData.discount.toFixed(2)}</Text>
                        <Text style={{color:"#7f7f7f"}}>{props.item.currency_sign}{TaxesPrice().toFixed(2)}</Text>
                        <Text style={{color:"#7f7f7f",borderBottomColor:"grey",borderBottomWidth:1}}>{props.item.currency_sign}{props.item.deliveryData.del_charge}.00</Text>
                        <Text style={{color:"#7f7f7f",marginTop:2}}>{props.item.currency_sign}{(subtotalPrice()+props.item.deliveryData.del_charge-couponCodeData.discount-rewardsValue+TaxesPrice()).toFixed(2)}</Text>
                      </View>
                  </View>
              </View>
              {rewardsButtonShow?<TouchableOpacity 
                onPress={() => {
                  if(props.item.userdata.user_id)
                  {
                    setRewardsButtonShow(false);
                    getrewardvalue()
                    if (props.item.userdata.rewards*rewardsv>=subtotalPrice()) {
                      console.log("Reward amount **")
                      setRewardsValue(subtotalPrice())
                    } else {
                     //console.log("Reward amount ")
                     setRewardsValue(props.item.userdata.rewards*rewardsv)
                    }
                  }
                  else
                  {
                    props.navigation.navigate("Auth");
                  }
                }}
                style={{borderColor:"#062FFF",borderWidth:1,borderRadius:10,width:"95%",marginLeft:"auto",marginRight:"auto",marginBottom:10}}>
                <View 
                  style={{flexDirection:"row",width:"95%",marginLeft:"auto",marginRight:"auto",justifyContent:"center",padding:10,paddingBottom:8,paddingTop:8}}>
                    <Text style={{flex:8,color:"#062FFF",textAlign:"center"}}>Use Rewards ({props.item.userdata.rewards?props.item.userdata.rewards:0})</Text>
                  <FontAwesome name="chevron-right" color="white" fontSize={40} style={{marginTop:"auto",marginBottom:"auto"}}/>
                </View>
              </TouchableOpacity>:<View 
                style={{borderColor:"#062FFF",borderWidth:2,borderRadius:10,width:"95%",marginLeft:"auto",marginRight:"auto",marginBottom:10}}>
                <View 
                  style={{flexDirection:"row",width:"95%",marginLeft:"auto",marginRight:"auto",justifyContent:"center",padding:10,paddingBottom:8,paddingTop:8}}>
                    <Text style={{flex:8,color:"#062FFF",textAlign:"center"}}>Rewards Applied!!</Text>
                  <FontAwesome name="chevron-right" color="white" fontSize={40} style={{marginTop:"auto",marginBottom:"auto"}}/>
                </View>
              </View>}
              <TouchableOpacity 
                onPress={() => {
                  if(props.item.userdata.user_id)
                  {
                    props.navigation.navigate("PromocodeScreen", {screen: "PromocodeScreen", params: {user_id: props.item.userdata.user_id, total_price: subtotalPrice()}})
                  }
                  else
                  {
                    props.navigation.navigate("Auth");
                  }
                  }}
                style={{backgroundColor:"#062FFF",borderRadius:10,width:"95%",marginLeft:"auto",marginRight:"auto"}}>
                <View 
                  style={{flexDirection:"row",width:"95%",marginLeft:"auto",marginRight:"auto",justifyContent:"center",padding:11,paddingBottom:10,paddingTop:10}}>
                  {couponCodeData.couponApplied?<Text style={{flex:8,color:"white"}}>{couponCodeData.couponName} Applied</Text>:<Text style={{flex:8,color:"white"}}>Apply Coupon</Text>}
                  <FontAwesome name="chevron-right" color="white" fontSize={40} style={{marginTop:"auto",marginBottom:"auto"}}/>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{width:"95%",marginLeft:"auto",marginRight:"auto",backgroundColor:"white",borderRadius:7,marginTop:20,marginBottom:20,elevation:10,padding:10}}>
                        {props.item.userAddressData.map((address)=>{
                                if(address.select_status === 1)
                                {
                                    return(
                                    <View 
                                        key={address.address_id}
                                        style={{width:"95%",marginLeft:"auto",marginRight:"auto",marginBottom:15}}>
                            
                                        <Text style={{fontWeight:"bold"}}>Name:- {address.receiver_name}</Text>
                                        <Text style={{color:"black"}}>Address:- {addresss}</Text>
                                        <Text style={{color:"black"}}>Contact:- {address.receiver_phone}</Text>
                                    </View>);
                                }
                        })}
                        
                        {   props.item.userAddressData.length !== 0?
                            (<View style={{backgroundColor:"#fff3cd",padding:5,marginBottom:10,borderColor:"orange",borderBottomWidth:2}}>
                            <Text style={{color:"grey",fontSize:12}}>Please make sure that this Address is correct for proper delivery.</Text>
                            </View>):

                            (<View style={{backgroundColor:"#fff3cd",padding:5,marginBottom:10,borderColor:"orange",borderBottomWidth:2}}>
                            <Text style={{color:"grey",fontSize:12}}>Please Add a Address for delivery.</Text>
                            </View>)
                        }
                        

                        <View >
                          <TouchableOpacity
                           onPress={()=> {props.item.userdata.user_id?props.navigation.navigate("AddressScreen"):props.navigation.navigate("Auth")}}
                           style={{backgroundColor:"#062FFF",borderRadius:10,flex:1,marginBottom:10,padding:10,alignItems:"center",marginLeft:2}}>
                              <Text style={{color:"white"}}>Change or Add address</Text>
                          </TouchableOpacity>
                        </View>
                        
                    </View>

            <View style={{width:"95%",elevation:10,marginLeft:"auto",marginRight:"auto",marginTop:30,marginBottom:20,padding:5,paddingTop:20,paddingBottom:20, backgroundColor:"white",borderRadius:10}}>
              <Text style={{color:"black",flex:1,marginBottom:10,width:"90%",marginLeft:"auto",marginRight:"auto",fontWeight:"bold",color:"black",paddingBottom:3,marginBottom:10}}>Customize Your Delivery</Text>
              {showDeliveryInstructionButton&&<TouchableOpacity
               onPress={()=> {
                setShowDeliveryInstructionButton(false); 
                setShowDeliverInsInput(!showDeliverInsInput)}}
               style={{borderColor:"#062FFF",borderWidth:2,borderRadius:10,flex:1,marginBottom:20,padding:10,alignItems:"center",width:"90%",marginLeft:"auto",marginRight:"auto"}}>
                  <Text style={{color:"#062FFF"}}>Add Delivery Instructions</Text>
              </TouchableOpacity>}
              {/* Delivery Instruction Input */}
              {showDeliverInsInput&&
              <View style={{marginBottom:20,marginTop:10,flexDirection:"row",marginBottom:20,marginLeft:3,borderColor:"grey",borderBottomWidth:1,width:"95%",marginLeft:"auto",marginRight:"auto"}}>
                <TextInput
                  defaultValue={deliveryInstruction}
                  onChangeText={(instruction) => {
                    setShowGreenTick(true);
                    setDeliveryInstruction(instruction)}}
                  style={{flex:7}} 
                  placeholder="Enter the Delivery Instructions here"/>
                {showGreenTick&&<FontAwesome name="check-circle" size={20} color="green" style={{marginLeft:3}}/>}
                </View>
              }

                <View>
                  <View>
                    <View style={{flexDirection:"column",marginBottom:10}}>
                      <View style={{flex:1}}>
                        <Text style={{color:"black",flex:1,marginBottom:10,width:"90%",marginLeft:"auto",marginRight:"auto"}}>Current Selected Date for Delivery:- </Text>
                      </View>
                      <View style={{flex:1}}>
                        <View style={{flexDirection:"row",width:"95%",marginLeft:"auto",marginRight:"auto"}}>
                          <Text style={{color:"black",
                            fontSize:15,
                            flex:1,
                            textAlign:"center",
                            marginLeft:2,
                            marginRight:2,
                            marginBottom:5}}>Date</Text>
                          <Text style={{color:"black",
                            fontSize:15,
                            flex:1,
                            textAlign:"center",
                            marginLeft:2,
                            marginRight:2,
                            marginBottom:5}}>Month</Text>
                          <Text style={{color:"black",
                            fontSize:15,
                            flex:1,
                            textAlign:"center",
                            marginLeft:2,
                            marginRight:2,
                            marginBottom:5}}>Year</Text>
                        </View>
                        <View style={{flexDirection:"row",width:"95%",marginLeft:"auto",marginRight:"auto"}}>
                          <Text 
                          onPress={showDatepicker}
                          style={{color:"#062FFF",
                            fontSize:20,
                            flex:1,
                            textAlign:"center",
                            marginLeft:10,
                            marginRight:10,
                            borderBottomWidth:1,
                            borderTopWidth:1,
                            borderTopColor:"grey",
                            borderBottomColor:"grey"}}>{('0' + (date.getDate())).slice(-2)}</Text>
                          <Text
                          onPress={showDatepicker}
                           style={{color:"#062FFF",
                            fontSize:20,
                            flex:1,
                            textAlign:"center",
                            marginLeft:10,
                            marginRight:10,
                            borderBottomWidth:1,
                            borderTopWidth:1,
                            borderTopColor:"grey",
                            borderBottomColor:"grey"}}>{('0' + (date.getMonth()+1)).slice(-2)}</Text>
                          <Text
                          onPress={showDatepicker}
                           style={{color:"#062FFF",
                            fontSize:20,
                            flex:1,
                            textAlign:"center",
                            marginLeft:10,
                            marginRight:10,
                            borderBottomWidth:1,
                            borderTopWidth:1,
                            borderTopColor:"grey",
                            borderBottomColor:"grey"}}>{date.getFullYear()}</Text>
                        </View>
                      </View>
                    </View>
                    
                    <TouchableOpacity onPress={showDatepicker} style={{backgroundColor:"#062FFF",padding:10,marginTop:10,marginBottom:10,borderRadius:10,width:"90%",marginLeft:"auto",marginRight:"auto"}}>
                      <Text style={{color:"white",textAlign:"center"}}>Choose a delivery date</Text>
                    </TouchableOpacity>
                  </View>
                  {show && (
                    // <DateTimePicker
                    //   testID="dateTimePicker"
                    //   value={date}
                    //   mode={mode}
                    //   is24Hour={true}
                    //   display="default"
                    //   onChange={onChange}
                    //   dateFormat="dayofweek day month"
                    //   minimumDate={new Date()}
                    // />
               <View></View>   )}
                </View>
                <View style={{width:"90%",marginLeft:"auto",marginRight:"auto",marginTop:10}}>
                  <Text style={{marginBottom:10,color:"black"}}>Choose a prefered Delivery Slot:-</Text>
                  <View style={{width:"95%",marginLeft:"auto",marginRight:"auto"}}>
                    <RadioForm
                      radio_props={radio_props}
                      initial={0}
                      onPress={(value) => {changeRadioValue(value)}}
                      borderWidth={1}
                      buttonColor={'#062FFF'}
                      // buttonOuterColor={"#062FFF"}
                      labelColor={"grey"}
                      buttonSize={15}
                      buttonOuterSize={25}
                      animation={true}
                    />
                    {/* <RadioButtonProject/> */}
                  </View>
                </View>
            </View>
					</ScrollView>
				)}
				
				{!cartItemsIsLoading &&
					<View style={{backgroundColor: '#fff', paddingVertical: 5}}>
						<View style={{flexDirection: 'row', height: 45, backgroundColor: '#062FFF'}}>
							<View style={{flexDirection: 'row', flexGrow: 1, flexShrink: 1, justifyContent: 'space-between', alignItems: 'center'}}>
								<View style={{flexDirection: 'row', paddingRight: 20, alignItems: 'center'}}>
									<Text style={{color: '#FFFFFF', fontWeight: 'bold'}}>SubTotal: </Text>
									<Text style={{color: '#FFFFFF', fontWeight: 'bold'}}>${((subtotalPrice()+props.item.deliveryData.del_charge-couponCodeData.discount-rewardsValue+TaxesPrice()).toFixed(2)) > 0?(subtotalPrice()+props.item.deliveryData.del_charge-couponCodeData.discount-rewardsValue+TaxesPrice()).toFixed(2):0}</Text>
								</View>
                <TouchableOpacity style={[styles.centerElement, {width: 100, height: 45, borderRadius: 5}]} 
                    onPress={() => {
                        if(props.item.userdata.user_id)
                        {
                          if(radio_props.length === 0)
                          {
                            Alert.alert("Please Choose a Valid Delivery Date!!")
                          }
                          else
                          {
                            var data = {
                              orderDate:finalDate,
                              orderTime:value,
                              del_ins:deliveryInstruction
                            }
                            //console.log("data for getorderdetailsdata is :-"+JSON.stringify(data))
                            //props.getOrderDetailsData(data);
                            console.log(data);
                            if(addresss.length==0){
                              Toast.show("Please Select Delivery Address")
                            }
                           else {
                            if(val === '1'){
                              console.error("**"+val);
                             
                              makeAddOrderRequest(couponCodeData,data,rewardsValue);

                             }
                             else{
                              console.error("**"+val);
                            
                  props.navigation.navigate("PaymentOptions", {screen: "PaymentOptions",params: {couponCodeData:couponCodeData,orderDetails:data, rewardsValue:rewardsValue}})

                            }
                          }
                           }
                        }
                        else
                          navigation.navigate("Auth")
                      }}>
                 
                  <Text style={{color: '#ffffff', fontWeight: 'bold'}}>Checkout</Text>
                </TouchableOpacity>
            
							</View>
						</View>
					</View>
				}
          
			</View>
      : 
      <SafeAreaView style={{flex:1, backgroundColor:'#F7F4F6', alignItems: 'center', justifyContent: 'center',}}>
        <View style={{justifyContent: 'center', alignItems: 'center',}}>
          <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 16,}}>
            NO ITEMS IN THE CART
          </Text>
        </View>
        <View>
          <Text style={{color: '#A8A5A7', margin: 20, textAlign: 'center',}}>
            Please add some of the items in cart that will appear here
          </Text>
        </View>
        <View style={{backgroundColor: '#062FFF',
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
                      width: 200,}}> 
          <TouchableOpacity onPress={() => navigation.replace("DrawerNavigationRoutes")}>
            <Text style={{color: '#FFFFFF',
                          paddingVertical: 10,
                          fontSize: 16,
                          textAlign: 'center',
                          fontWeight: 'bold',}}>SHOP NOW</Text>
          </TouchableOpacity>
        </View>

        
      </SafeAreaView>
		);
	

}
const mapStateToProps = (state) => {
  return({
      item:state.item
  })
}
export default connect(mapStateToProps, {getItems,getLocation,updatedCart,getHomescreenData,getUserAddress,getOrderDetailsData})(Cart);

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
  dateHead:{
    color:"grey",
    fontSize:15,
    flex:1,
    textAlign:"center",
    marginLeft:2,
    marginRight:2,
    marginBottom:5
  },
  dateStyle:{
    color:"#062FFF",
    fontSize:20,
    flex:1,
    textAlign:"center",
    marginLeft:10,
    marginRight:10,
    borderBottomWidth:1,
    borderTopWidth:1,
    borderTopColor:"grey",
    borderBottomColor:"grey"
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width:"100%",
    marginLeft:"auto",
    marginRight:"auto",
    height:"100%",
    backgroundColor: '#00000040',

},
modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
},
modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize:20,
    color:"grey"
},
button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    width:120
},
buttonClose: {
    backgroundColor: "#062FFF",
},
container: {
  flex:1,
  padding:10,
},
paymentTitle: {
  color: "#272422",
  fontSize: 16,
},
mainContainer: {
  height: 50,
  marginTop: 10,
  marginBottom: 10,
  marginLeft: 10,
  marginRight: 10,
  justifyContent: "center",
  paddingLeft: 10,
  paddingRight: 10,
  borderWidth: 1,
  borderColor: "#DBD6D2",
  flexDirection: "row",
  borderRadius: 10,
  alignItems: "center",
},
mainCheckedContainer: {
  height: 50,
  marginTop: 10,
  marginBottom: 10,
  marginLeft: 10,
  marginRight: 10,
  justifyContent: "center",
  paddingLeft: 10,
  paddingRight: 10,
  borderWidth: 1,
  borderColor: "#DB7E21",
  backgroundColor: "#DB7E21",
  flexDirection: "row",
  borderRadius: 10,
  alignItems: "center",
},
radioButtonIcon: {
  backgroundColor: "white",
  borderWidth: 3,
  borderColor: "green",
  height: 25,
  width: 25,
  borderRadius: 30 / 2,
  marginRight: 10,
  alignItems: "center",
  justifyContent: "center",
},
radioButtonIconInnerIcon: {
  height: 20,
  width: 20,
  backgroundColor: "green",
  borderRadius: 25 / 2,
  borderWidth: 3,
  borderColor: "white",
},
radioButtonTextContainer: {
  flex: 5,
  height: 50,
  justifyContent: "center",
  paddingLeft: 10,
},
radioButtonText: {
  fontSize: 14,
},
applyButton: {
  flex:1,
  backgroundColor:"#062FFF",
  width:"100%",
  marginLeft:"auto",
  marginRight:"auto",
  padding:7,
  alignItems:"center",
  borderRadius: 10,
},
rewardspointWrap: {
  flex:1,
  justifyContent: "center",
  marginTop: 10,
},
rewardspoint: {
  color: "#BAB8B6",
  fontSize: 12, 
  textAlign: "center",
},
paynowButton: {
  flex:1,
  backgroundColor:"#062FFF",
  width:"100%",
  marginLeft:"auto",
  marginRight:"auto",
  padding:10,
  alignItems:"center",
  borderRadius: 15,
},

modalView: {
  margin: 20,
  backgroundColor: "white",
  borderRadius: 20,
  padding: 35,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5
},
modalText: {
  marginBottom: 15,
  textAlign: "center",
  fontSize:20,
  color:"grey"
},
button: {
  borderRadius: 20,
  padding: 10,
  elevation: 2,
  marginTop: 15,
  width:120
},
buttonClose: {
  backgroundColor: "#062FFF",
},
textStyle: {
  color: "white",
  fontWeight: "bold",
  textAlign: "center"
},

textStyle1: {
  fontSize:16,
  textAlign: "center",
  flexDirection:"row-reverse"
},

checkboxContainer: {
  flexDirection: "row",
},
checkbox: {
  alignSelf: "center",
  color:"green"
},
label: {
  flex: 5,
  height: 50,
  justifyContent: "center",
},
});