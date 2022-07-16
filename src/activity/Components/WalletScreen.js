import * as React from 'react';
import {useState,useEffect} from "react";
import {Text,StyleSheet, View, Image,TextInput,Alert} from 'react-native';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import Loader from '../Components/Loader';
import {connect} from "react-redux";
import {getItems,getLocation,updatedCart,getHomescreenData,getAllProducts, getCurrency,getDeliveryData,getUserData} from "../../actions/itemsAction.js";


const WalletScreen = (props) => {
  var [cardDetailsEntered,setCardDetailsEntered] = useState(false);
  var [loading,setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [amount,setAmount] = useState(0);
  var [cartId, setCartId] = useState("");
  var [token,setToken] = useState(null);
  var [country, setCountry] = useState("");
  var [paymentStatus, setPaymentStatus] = useState("");
  var [country, setCountry] = useState("");
  var [wallet, setWallet] = useState(props.item.userdata.wallet);
  
  useEffect(() => {
    var formdata = new FormData();
    formdata.append("user_id",props.item.userdata.user_id );

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    fetch("http://justcomfort.umbeo.com/admin/api/myprofile", requestOptions)
      .then(response => response.json())
      .then(async result => {
        console.log(result)
        await props.getUserData(result.data)
        setWallet(result.data.wallet)

      })
      .catch(error => console.log('error', error));
    
  }, [])
  
  const getCountryLocation = () =>{
    fetch("http://maps.googleapis.com/maps/api/geocode/json?address=" + props.item.latitude + "," + props.item.longitude + "&key=" + "AIzaSyCKabiwGyic2E7QicGIz2Fs_D81DCnWb1Y")
          .then((response) => response.json())
          .then((responseJson) => {
            responseJson.results[0].address_components.map((address) => {
              console.log(address.types[0]);
              if(address.types[0] == "country"){
                setCountry(address.long_name);
              }
            })
            const userLocation = responseJson.results[0].formatted_address;

        });
  }
  const handleCardDetails = async () => {
    // console.log("amount is:-"+amount);
    // try {
    //   setLoading(false);
    //   var billingAddress = {};
    //   console.log(country);
    //   props.item.userAddressData.map((address)=>{
    //     if(address.select_status === 1)
    //     {
    //         billingAddress.name= address.receiver_name,
    //         billingAddress.line1= address.house_no,
    //         billingAddress.line2= address.landmark,
    //         billingAddress.city= address.city,
    //         billingAddress.state= address.state,
    //         billingAddress.country= country,
    //         billingAddress.postalCode= address.pincode
    //     }
    //   });

    //   const cardOptions = { 
    //     smsAutofillDisabled: true,
    //     requiredBillingAddressFields: 'full',
    //        prefilledInformation: {
    //         billingAddress,
    //       }
    //   };
    //   console.log("cardOptions");
    //   console.log(cardOptions);
    //   // GETS YOUR TOKEN FROM STRIPE FOR PAYMENT PROCESS
    //   const receivedToken = await Stripe.paymentRequestWithCardFormAsync(cardOptions);

    //   console.log(receivedToken);
    //   setLoading(false);
    //   setToken(receivedToken.tokenId);
    //   setCardDetailsEntered(true);
    //   console.log("Set card details is set to:-"+cardDetailsEntered);
    //   //handlePayment();
    // } catch(error) {
    //   setLoading(false);
    //   // this.setState({ loading: false });
    // }
}
const handlePayNowButton = () =>{
      setLoading(true);
      console.log("Handle payment called")
      // var formdata = new FormData();
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
      //     console.log(result.status);
      //     if(result.status == "succeeded"){
      //       console.log(result.payment_method_details.type);
      //       setPaymentStatus("success");
      //       handleCheckOutAPI(result.payment_method_details.type, "success");
      //     }
      //   })
      //   .catch(error => {
      //       console.log('error', error)
      //       Alert.alert(
      //         "We are unable to process your payment through card, please try again later!!",
      //         [
      //           { text: "OK", onPress: () => props.navigation.replace("DrawerNavigationRoutes") }
      //         ]
      //       );
      //     });
 
}
const handleCheckOutAPI = (method, status) => {
  var formdata = new FormData();
  formdata.append("user_id", props.item.userdata.user_id);
  formdata.append("amount", amount);
  formdata.append("recharge_status", status);

  var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };

  fetch("http://justcomfort.umbeo.com/admin/api/recharge_wallet", requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result)
      if(result.status == "1")
      {
        var form = new FormData();
        form.append("user_id", props.item.userdata.user_id);

        var requestOptions = {
          method: 'POST',
          body: form,
          redirect: 'follow'
        };

        fetch("http://justcomfort.umbeo.com/admin/api/walletamount", requestOptions)
          .then(response => response.json())
          .then(result => {
            var newuserdata = props.item.userdata;
            newuserdata.wallet = result.data;
            props.getUserData(newuserdata);
          })
          .catch(error => console.log('error', error));


        setLoading(false);
        Alert.alert(
          "Wallet Recharged Successfully",
          result.message,
          [
            { text: "OK", onPress: () => props.navigation.replace("DrawerNavigationRoutes") }
          ]
        );
      }
      else
      {
        setLoading(false);
        Alert.alert(
          "Recharge Unsuccessfully",
          [
            { text: "OK", onPress: () => props.navigation.replace("DrawerNavigationRoutes") }
          ]
        );
      }
    })
    .catch(error => {
      console.log('error', error)
      setLoading(false);
        Alert.alert(
          "We encountered Some error while processing your request. Try again later!!",
          [
            { text: "OK", onPress: () => props.navigation.replace("DrawerNavigationRoutes") }
          ]
        );
    });
}

  return (
    <ScrollView>
      <Loader loading={loading} />
      <View style={styles.maincontainer}>
        <View style={styles.walletImage}>
          <Image
            source={require('../../../assets/wallet.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.textwallet}>
            <Text style={styles.wallet}>
               My Wallet Amount
            </Text>
            <Text style={styles.dollarvalue}>
              {props.item.currency_sign} {wallet}
            </Text>
        </View>
        <View > 
            {clicked?<View>
              <TextInput
                  style={{color: '#424242',borderColor:"#062FFF",borderWidth:2,width:300,padding:7,borderRadius:50,marginBottom:15,textAlign:"center"}}
                  keyboardType = 'numeric'
                  placeholder="Amount"
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#6C6969"
                  onChangeText={(newamount) => setAmount(newamount)}
                />
              
              {/* {
              cardDetailsEntered === false?<CardButton
                style={{borderRadius:10,width:300,marginLeft:0,borderColor:"#062FFF",}}
                text="Enter Card Details"
                loading={loading}
                onPress={handleCardDetails}
              />
              :<Text style={{color:"#062FFF",width:"90%",marginLeft:"auto",marginRight:"auto",marginBottom:20,}}>
                  Card Details are entered, click Pay now!!
              </Text>}

              {setCardDetailsEntered?<TouchableOpacity 
                onPress={handlePayNowButton}
                style={{backgroundColor:"#062FFF",width:300,borderRadius:10,padding:10,marginBottom:20,}}>
                <Text style={{textAlign:"center",color:"white"}}>Pay Now</Text>
              </TouchableOpacity>:<View></View>} */}
            </View>:
            <TouchableOpacity style={{backgroundColor:"#062FFF",width:200,borderRadius:10}}
            onPress={() => {
              if(props.item.userdata.user_id === undefined)
              {
                props.navigation.navigate("Auth");
              }
              getCountryLocation;
              setClicked(true);
            }}>
              <Text style={styles.textRecharge}>Recharge Wallet</Text>
            </TouchableOpacity>}
        </View>
    </View>
    </ScrollView>
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
export default connect(mapStateToProps, {getItems,getLocation,updatedCart,getHomescreenData,getAllProducts,getCurrency,getDeliveryData,getUserData})(WalletScreen);

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1, 
    alignItems: 'center'
  },
  walletImage: {
    marginTop:200
  },
  input: {
    flex: 1,
    paddingTop: 7,
    paddingRight: 7,
    paddingBottom: 7,
    paddingLeft: 0,
    color: '#424242',
  },
  image: {
    width: 150,
    height: 130,
  },
  wallet:{
    fontSize: 17,
    marginTop:20
  },
  textwallet: {
    alignItems: 'center',

  },
  dollarvalue:{
    fontSize: 25,
    marginTop:10,
    marginBottom:20
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
      marginBottom: 25,
      width: 200,
  },
  textRecharge: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});