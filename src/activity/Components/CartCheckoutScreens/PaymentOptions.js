import React,{useState,useEffect} from "react";
import {CheckBox, StyleSheet, SafeAreaView, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, Modal } from 'react-native';
import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import {connect} from "react-redux";
import {getItems,getLocation,updatedCart,getHomescreenData,getUserAddress,getOrderDetailsData,getCouponDiscount} from "../../../actions/itemsAction";
import { TextInput } from "react-native-gesture-handler";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from "react-native-simple-radio-button";
import Toast from 'react-native-simple-toast';
import Loader from '../Loader';

const PaymentOptions = (props) => 
{
    var [cardDetailsEntered,setCardDetailsEntered] = useState(false);
    var [isCheckedWallet,setCheckedWallet] = useState(false);
    var [isCheckedCOD,setCheckedCOD] = useState(false);
    var [isCheckedCard,setCheckedCard] = useState(false);
    var [cartItemsArray,changeCartItemsArray] = useState(props.item.cartItems);
    var [loading,setLoading] = useState(false);
    var [paymentMethod,setPaymentMethod] = useState("");
    var [cartId, setCartId] = useState("");
    var [token,setToken] = useState(null);
    var [country, setCountry] = useState("");
    var [paymentStatus, setPaymentStatus] = useState("");
    var [showPayNowButton,setShowPayNowButton] = useState(false);
    var [rewardLine1,setRewardLine1] = useState("");
    var [rewardLine2,setRewardLine2] = useState("");
    var [couponDiscount,setCouponDiscount] = useState(0);
    var [promocodeData,setPromocodeData] = useState([]);
    var [showPromoCode, setShowPromoCode] = useState(true);
    var [showPromoCodeCheckButton, setShowPromoCodeCheckButton] = useState(true);
    var [showRedeemRewards,setshowRedeemRewards] = useState(true);
    var [rewardsRedeemed,setRewardsRedeemed] = useState(false);
    var [successModal, setSuccessModal] = useState(false);
    var [couponCodeData,setCouponCodeData] = useState(props.item.couponDiscount);
    var [rewardsValue,setRewardsValue] = useState(props.route.params.rewardsValue);
    var [amount,setAmount] = useState("");

    var [rew,setRew] = useState("");
    var [coupon,setCoupon] = useState("");



    const redeemRewards = () =>{
        setLoading(true);
        var formdata = new FormData();
        formdata.append("user_id", props.item.userdata.user_id);

        var requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };

        fetch("http://justcomfort.umbeo.com/admin/api/redeem_rewards", requestOptions)
          .then(response => response.json())
          .then(async result => {
              console.log(result)
              await Toast.show(result.message);
              setRewardsRedeemed(true);
              setLoading(false)
          })
          .catch(async error => {
            console.log('error', error)
            await Toast.show("Unable to reedem rewards!!");
            setLoading(false);
            });
    }

    const fetchCouponCodes = () => {
        setLoading(true);
        var formdata = new FormData();
        formdata.append("cart_id", cartId);

        var requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };

        fetch("http://justcomfort.umbeo.com/admin/api/couponlist", requestOptions)
          .then(response => response.json())
          .then(async result => {
              console.log(result);
              await setPromocodeData(result.data);
              await showPromoCodeCheckButton(false);
              setLoading(false);
            })
          .catch(error => {
              console.log('error', error)
              setLoading(false);
        });
    }

    const handleSubmitCupon = (coupon_code) =>{
        setLoading(true);
        console.log("Called")
        var formdata = new FormData();
        formdata.append("coupon_code", coupon_code);
        formdata.append("cart_id", cartId);

        var requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };

        fetch("http://justcomfort.umbeo.com/admin/api/apply_coupon", requestOptions)
          .then(response => response.json())
          .then(async result => {
              console.log(result.data.coupon_discount)
                setCouponDiscount(result.data.coupon_discount);
                // await props.getCouponDiscount(result.data.coupon_discount)
                // props.navigation.goBack();
                setShowPromoCode(false);
                setLoading(false);
            })
          .catch(error =>{ 
            console.log('error', error)
            setLoading(false);
            });
    }
    // var [orderDate,setOrderDate] =useState("");
    
    // var [orderTime,setOrderTime] =useState("");
    useEffect(() => {
        // setOrderDate(props.route.params.orderDate);
        // setOrderTime(props.route.params.orderTime);
        setLoading(true);
        console.log("data for getorderdetailsdata is in payment options :-"+JSON.stringify(props.route.params.orderDetails))
        props.getOrderDetailsData(props.route.params.orderDetails);
        _getPaymentMethod();
        // console.log(props.item.currency_name);
        fetch("http://maps.googleapis.com/maps/api/geocode/json?address=" + props.item.latitude + "," + props.item.longitude + "&key=" + "AIzaSyCKabiwGyic2E7QicGIz2Fs_D81DCnWb1Y")
          .then((response) => response.json())
          .then((responseJson) => {
            responseJson.results[0].address_components.map((address) => {
            //   console.log(address.types[0]);
              if(address.types[0] == "country"){
                setCountry(address.long_name);
              }
            })
            const userLocation = responseJson.results[0].formatted_address;
        
        });
        setLoading(false);

       

        amount = (subtotalPrice()+props.item.deliveryData.del_charge-couponCodeData.discount-rewardsValue+TaxesPrice()).toFixed(2);
        setAmount(amount)
    
        if(props.route.params.rewardsValue!=null)
{
     setRew("0")
}else{
    setRew(props.route.params.rewardsValue)
}
if(props.route.params.couponCodeData.couponName!=null)
{
    setCoupon("0")
}else{
    setCoupon(props.route.params.couponCodeData.couponName)
}
    
    }, []);

    const _getPaymentMethod = async () => {
        let response = await fetch(
            'http://justcomfort.umbeo.com/admin/api/pymnt_via'
        );
        let json = await response.json();
        let paymentData = json.data;

        if(paymentData.paypal == 1){
            setPaymentMethod("paypal")
        }else if(paymentData.razorpay == 1){
            setPaymentMethod("razorpay")
        }else if(paymentData.paystack == 1){
            //setPaymentMethod("stripe")
        }
        _getCartOrderID();
    };

    const handleCardDetails = async () => {
    //     try {
    //       setLoading(false);
    //       var billingAddress = {};
    //     //   console.log(country);
    //       props.item.userAddressData.map((address)=>{
    //         if(address.select_status === 1)
    //         {
    //             billingAddress.name= address.receiver_name,
    //             billingAddress.line1= address.house_no,
    //             billingAddress.line2= address.landmark,
    //             billingAddress.city= address.city,
    //             billingAddress.state= address.state,
    //             billingAddress.country= country,
    //             billingAddress.postalCode= address.pincode
    //         }
    //       });
    
    //       const cardOptions = { 
    //         smsAutofillDisabled: true,
    //         requiredBillingAddressFields: 'full',
    //            prefilledInformation: {
    //             billingAddress,
    //           }
    //       };
    //     //   console.log("cardOptions");
    //     //   console.log(cardOptions);
    //       // GETS YOUR TOKEN FROM STRIPE FOR PAYMENT PROCESS
    //       const receivedToken = await Stripe.paymentRequestWithCardFormAsync(cardOptions);
    
    //     //   console.log(receivedToken);
    //       setLoading(false);
    //       setToken(receivedToken.tokenId);
    //       setCardDetailsEntered(true);
    //         setShowPayNowButton(true);
    //     //   console.log("Set card details is set to:-"+cardDetailsEntered);
    //       //handlePayment();
    //     } catch(error) {
    //       setLoading(false);
    //       // this.setState({ loading: false });
    //     }
    // 
    }

    const _getCartOrderID = () => {
        // console.log("checking..");
        var tempArray=[];
        // console.log("the length of array is "+ cartItemsArray.length);
        // console.log(cartItemsArray);
        for(var i=0;i<cartItemsArray.length;i++)
        {
            // console.log(`Item ${i} has qty:- ${cartItemsArray[i].qty} , varient-id:- ${cartItemsArray[i].varient_id} and img:- ${cartItemsArray[i].product_image}`)
            var temp = {
                qty: cartItemsArray[i].qty,
                varient_id: cartItemsArray[i].varient_id,
                product_image: cartItemsArray[i].product_image
            }
            // console.log(temp);
            tempArray.push(temp);
        }
        // console.log(JSON.stringify(tempArray));
        // console.log(`Value: user_id: ${props.item.userdata.user_id} cart: ${cartItemsArray}`)
       
        let dataToSend = {
            time_slot: props.route.params.orderDetails.orderTime, 
            delivery_date: props.route.params.orderDetails.orderDate,
            store_id:  props.item.homepageData.recent_selling[0].store_id,
            user_id: props.item.userdata.user_id,
            delivery_instructions: props.route.params.orderDetails.del_ins,
            order_array: JSON.stringify(tempArray),
            rewards:rew,
            coupon_code:coupon
        };

        //console.error(dataToSend)

        let formBody = [];
        for (let key in dataToSend) {
            let encodedKey = encodeURIComponent(key);
            let encodedValue = encodeURIComponent(dataToSend[key]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        console.log(`The time is ${props.route.params.orderDetails.orderTime} and date is ${props.route.params.orderDetails.orderDate}` );

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
                var data={};
                await props.getOrderDetailsData(data);
                _getRewardLines(result.data.cart_id);
            }
          })
          .catch(error => console.log('error comming from Make_An_order_Api', error));
    };
    const _getRewardLines= (cart_id) => {
        // console.log("Reward Linew called with cartID:-"+cartId)
        var formdata = new FormData();
        formdata.append("cart_id", cart_id);
            
        var requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };
        
        fetch("http://justcomfort.umbeo.com/admin/api/rewardlines", requestOptions)
          .then(response => response.json())
          .then(result =>{ 
            //   console.log("Reward Lines data is:-"+result)
                setRewardLine1(result.line1);
                setRewardLine2(result.line2);
            })
          .catch(error => console.log('error comming from Reward Lines', error));
    }
    const _renderCheckedViewWallet = () => {
        return isCheckedWallet ? (
          <View  />
        ) : null;
    }; 

    const _renderCheckedViewCOD = () => {
        return isCheckedCOD ? (
          <View style={[styles.radioButtonIconInnerIcon]} />
        ) : null;
    }; 

    const _renderCheckedViewCard = () => {
        return isCheckedCard ? (
          <View style={[styles.radioButtonIconInnerIcon]} />
        ) : null;
    }; 

    const walletRadioButtonPress = () => {
      
        if(isCheckedWallet)
            {
                setCheckedWallet(false);
            }
        else {
            setCheckedWallet(true);
        
            setShowPayNowButton(true)
            if(props.item.userdata.wallet < amount){
                const amo = (amount - props.item.userdata.wallet).toFixed(2);
                setAmount(amo)
            }
            if(props.item.userdata.wallet >= amount){
                //amount = (amount-props.item.userdata.wallet).toFixed(2);
                setAmount(0)
                setCheckedCOD(false)
                setCheckedCard(false)
                setShowPayNowButton(true);
            }
        }
    }

    const codRadioButtonPress = () => {
        if(isCheckedCOD){
            setCheckedCOD(false);
            setShowPayNowButton(false);}
        else {
            setCheckedWallet(false);
            setCheckedCOD(true);
            setCheckedCard(false);
            setShowPayNowButton(true);
        }
        const amount = (subtotalPrice()+props.item.deliveryData.del_charge-couponCodeData.discount-rewardsValue+TaxesPrice()).toFixed(2);
        setAmount(amount)
        
    }

    const cardRadioButtonPress = () => {
        if(isCheckedCard)
            setCheckedCard(false);
        else {
            setCheckedWallet(false);
            setCheckedCOD(false);

            setCheckedCard(false);

            setShowPayNowButton(false);
        }
        const amount = (subtotalPrice()+props.item.deliveryData.del_charge-couponCodeData.discount-rewardsValue+TaxesPrice()).toFixed(2);
        setAmount(amount)
    }

    const handlePayNowButton = () =>{

        if(isCheckedCard === true)
        {
            setLoading(true);
            console.log("Handle payment called")
            // var formdata = new FormData();
            // let amount = (subtotalPrice()+props.item.deliveryData.del_charge-couponCodeData.discount-rewardsValue+TaxesPrice()).toFixed(2);
            // formdata.append("amount", amount*100);
            // formdata.append("currency", props.item.currency_name);
            // formdata.append("token", token);

            // var requestOptions = {
            //   method: 'POST',
            //   body: formdata,
            //   redirect: 'follow'
            // };
        
            // fetch("http://justcomfort.umbeo.com/admin/api/stripe_api", requestOptions)
            //   .then(response => response.json())
            //   .then(result => {
            //     console.log(result.stat1us);
            //     if(result.status == "succeeded"){
            //       console.log(result.payment_method_details.type);
            //       setPaymentMethod(result.payment_method_details.type);
            //       setPaymentStatus("success");
            //       handleCheckOutAPI(result.payment_method_details.type, "success");
            //     }
            //   })
            //   .catch(error => {
            //       console.log('error', error)
            //       Alert.alert(
            //         "We are unable to process your payment through card, please try again later!!",
            //         result.message,
            //         [
            //           { text: "OK", onPress: () => props.navigation.replace("DrawerNavigationRoutes") }
            //         ]
            //       );
            //     });
        }
        // props.navigation.navigate("PaymentStripe", {cart_id: cartId})
        else if(isCheckedCOD === true)
        {
            setLoading(true);
            handleCheckOutAPI("COD", "success");
        }
        else if(isCheckedWallet ===true)
        {
            if(amount==0) handleCheckOutAPI("COD", "success");
            else handleCheckOutAPI("COD", "pending");
        }
    }
    const handleCheckOutAPI = (method, status) => {
        // setLoading(true);
        // console.log(props.route.params.cart_id);
        // console.log("Method >> " + paymentMethod + ">>> " + method);
        // console.log("status >> " + paymentStatus + ">>> " + status);
        // console.log(props.item.userdata.user_id);
        var wallet = "";
        if(isCheckedWallet==true)
            wallet="yes";
        var formdata = new FormData();
        formdata.append("user_id", props.item.userdata.user_id);
        formdata.append("payment_status", status);
        formdata.append("cart_id", cartId);
        formdata.append("payment_method", method);
        formdata.append("wallet",wallet );
    
        var requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };
    
        fetch("http://justcomfort.umbeo.com/admin/api/checkout", requestOptions)
          .then(response => response.json())
          .then(result => {
             console.log("The checkout formdata is:-"+JSON.stringify(formdata));
            if(result.status == "2" || result.status == "1"){
                console.log('checkout ', result)
              setLoading(false);
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

    var touchWalletProps = {
        style: isCheckedWallet ? styles.mainCheckedContainer : styles.mainContainer,
        onPress: () => walletRadioButtonPress(),  
    }

    var touchCODProps = {
        style: isCheckedCOD ? styles.mainCheckedContainer : styles.mainContainer,
        onPress: () => codRadioButtonPress(),  
    }

    var touchCardProps = {
        style: isCheckedCard ? styles.mainCheckedContainer : styles.mainContainer,
        onPress: () => cardRadioButtonPress(),  
    }

    const subtotalPrice = () => {
	    // const { cartItems } = cartItems;
	    if(cartItemsArray){
            var price = cartItemsArray.reduce((sum, item) => sum  + (item.qty * item.price), 0 );
	    	return price;
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

   const onWalletCheck = () => {
 
       if(isCheckedWallet)
       {
           setCheckedWallet(false);
       }
   else {
       setCheckedWallet(true);
   
       setShowPayNowButton(true)
       if(props.item.userdata.wallet < amount){
           const amo = (amount - props.item.userdata.wallet).toFixed(2);
           setAmount(amo)
       }
       if(props.item.userdata.wallet >= amount){
           //amount = (amount-props.item.userdata.wallet).toFixed(2);
           setAmount(0)
           setCheckedCOD(false)
           setCheckedCard(false)
           setShowPayNowButton(true);
       }
   }

   }

    const successOrder = () => {
        setSuccessModal(!successModal);
        props.navigation.reset({
            index: 0,
            routes: [{name: 'DrawerNavigationRoutes'}],
          });
    }

    return(
        <SafeAreaView style={styles.container}>
            <Loader loading={loading} />
            <ScrollView>
                         
                <TouchableOpacity
                        onPress={_renderCheckedViewWallet()}

                 {...touchWalletProps}>
                <View style={[styles.radioButtonTextContainer]}>
                        <Text style={styles.radioButtonText}>Use Wallet</Text>
                        <Text style={styles.radioButtonText}>{props.item.currency_sign} {(props.item.userdata.wallet).toFixed(2)}</Text>
                    </View>
                    <View style={[styles.checkbox]}>
        <CheckBox
onChange={() => onWalletCheck()} 
          value={isCheckedWallet}
          style={styles.checkbox}
        
        />
      </View>    
              
                </TouchableOpacity>
                {
          amount!=0 && isCheckedWallet?
          <View>
                <View>
                <Text>Choose Method to Pay Remaining Amount: {props.item.currency_sign} {amount}</Text>
                </View>
              </View>
              :
              <View>

              </View>
      } 
              
                <TouchableOpacity {...touchCODProps}>
                    <View style={[styles.radioButtonTextContainer]}>
                        <Text style={styles.radioButtonText}>Cash on delivery</Text>
                    </View>
                    <View style={[styles.radioButtonIcon]}>
                        {_renderCheckedViewCOD()}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity {...touchCardProps}>
                    <View style={[styles.radioButtonTextContainer]}>
                        <Text style={styles.radioButtonText}>Credit/Debit Card/Net Banking</Text>
                    </View>
                    <View style={[styles.radioButtonIcon]}>
                        {_renderCheckedViewCard()}
                    </View>
                </TouchableOpacity>
                {isCheckedCard?<View>
                    {/* {cardDetailsEntered === false?<CardButton
                      text="Card Details"
                      loading={loading}
                      onPress={handleCardDetails}
                    />:<Text style={{color:"#062FFF",width:"90%",marginLeft:"auto",marginRight:"auto"}}>
                        Card Details are entered, click Pay now!!
                    </Text>
                    } */}
                    {/* <TouchableOpacity >
                        <Text style={{textAlign:"center",color:"white"}}>Enter Card Details</Text>
                    </TouchableOpacity> */}
                </View>:<View></View>}
                {/* REWARDS BUTTON */}
                {/* {rewardsRedeemed?<Text style={{color:"#062FFF",backgroundColor:"white",elevation:5,textAlign:"center",padding: 10,borderRadius:10,width:"95%",marginLeft:"auto",marginRight:"auto",marginTop:10,marginBottom:20}}>Rewards are Redeemed!!</Text>:
                <View>
                    {props.item.userdata.rewards > 0?<TouchableOpacity
                        onPress={()=> {redeemRewards()}}
                        style={{backgroundColor:"#062FFF",padding: 10,borderRadius:10,width:"95%",marginLeft:"auto",marginRight:"auto",marginTop:10,marginBottom:20}}
                        >
                        <Text style={{color:"white",textAlign:"center"}}>Redeem Rewards ({props.item.userdata.rewards})</Text>
                    </TouchableOpacity>:
                    <View style={{backgroundColor:"#062FFF",opacity:.5,padding: 10,borderRadius:10,width:"95%",marginLeft:"auto",marginRight:"auto",marginTop:10,marginBottom:20}}>
                        <Text style={{color:"white",textAlign:"center"}}>Redeem Rewards ({props.item.userdata.rewards})</Text>
                    </View>}
                </View>
                } */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={successModal}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setSuccessModal(!successModal);
                    }}
                >
                    <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Order Placed!!</Text>
                        <AntDesign name="checkcircleo" size={50} color="#52C829" />
                        <TouchableOpacity
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => successOrder()}
                        >
                        <Text style={styles.textStyle}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </Modal>
                {/* APPLY PROMOCODE  */}
                {/* {showPromoCode?<View style={{width:"95%",marginRight:"auto",marginLeft:"auto",padding:10,borderRadius:10,backgroundColor:"white"}}>
                    <View style={{flexDirection:"row",justifyContent:"center",borderBottomColor:"grey",borderBottomWidth:1,marginBottom:10,paddingBottom:10}}>
                        <Text style={{flex:2,alignSelf:"center"}}>Promo Code</Text>
                        {showPromoCodeCheckButton?<TouchableOpacity
                            onPress={()=>fetchCouponCodes()}
                            style={{flex:1,backgroundColor:"#062FFF",padding: 7,borderRadius:10}}
                            >
                            <Text style={{color:"white",textAlign:"center"}}>Check</Text>
                        </TouchableOpacity>:
                        <View style={{flex:1}}></View>}
                    </View>
                    <ScrollView>
                        <Loader loading={loading}/>
                        {promocodeData.map(code => {
                            return(
                            <View
                             key={code.coupon_id}
                             style={{flexDirection:"row",width:"95%",marginLeft:"auto",marginRight:"auto",marginTop:10,marginBottom:5,backgroundColor:"#F2EDED",padding: 10,borderRadius:10}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:"black",fontSize:20,fontWeight:"bold",marginBottom:10}}>{code.coupon_name}</Text>
                                    <Text style={{color:"grey"}}>{code.coupon_description}</Text>
                                </View>
                                <View style={{flex:1}}>
                                    <Text style={{borderWidth:1,borderColor:"grey",borderRadius:10,padding:5,textAlign:"center",marginBottom:10}}>{code.coupon_code}</Text>
                                    <TouchableOpacity 
                                        onPress={() => handleSubmitCupon(code.coupon_code)}
                                        style={{padding:7,backgroundColor:"#062FFF",borderRadius:10}}>
                                        <Text style={{textAlign:"center",color:"white"}}>Apply</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>)
                        })}
                    </ScrollView>
                </View>:<View style={{width:"95%",marginRight:"auto",marginLeft:"auto",padding:10,borderRadius:10,backgroundColor:"white",elevation:5}}>
                    <Text style={{color:"#062FFF",textAlign:"center"}}>Promo Code Applied!!</Text>
                    </View>} */}
                <View style={styles.rewardspointWrap}>
                    <Text style={styles.rewardspoint}>Checkout Rewards</Text>
                </View>
                <View style={styles.rewardspointWrap}>
                    <Text style={styles.rewardspoint}>{rewardLine1}</Text>
                </View>
                <View style={styles.rewardspointWrap}>
                    <Text style={[styles.rewardspoint, {marginTop: 20,}]}>{rewardLine2}</Text>
                </View>
            </ScrollView>
            <View style={{flexDirection:"row",position:"relative",bottom:0}}>
                <View style={{flex:2}}>
                    <Text style={{marginLeft:10,fontWeight:"bold",fontSize:15}}>Total Amount:</Text>
                    <Text style={{marginLeft:10,fontWeight:"bold",fontSize:15,color:"grey"}}>{props.item.currency_sign}{amount}</Text>
                </View>

                {isCheckedWallet || isCheckedCOD || isCheckedCard ?<TouchableOpacity
                    style={styles.paynowButton} onPress={handlePayNowButton}>
                    <Text style={{color:"white", fontWeight:"bold"}}>PAY NOW</Text>
                </TouchableOpacity>:
                <View style={{flex:1,
                    backgroundColor:"#062FFF",
                    width:"100%",
                    opacity:.5,
                    marginLeft:"auto",
                    marginRight:"auto",
                    padding:10,
                    alignItems:"center",
                    borderRadius: 15,}}>
                    <Text style={{color:"white", fontWeight:"bold"}}>PAY NOW</Text>    
                </View>}
            </View>
        </SafeAreaView>
    );
}


const mapStateToProps = (state) => {
    return({
        item:state.item
    })
}
export default connect(mapStateToProps, {getItems,getLocation,updatedCart,getHomescreenData,getUserAddress,getOrderDetailsData,getCouponDiscount})(PaymentOptions);

const styles = StyleSheet.create({
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