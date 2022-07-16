import React,{useState,useEffect} from "react";
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert,Button } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import {connect} from "react-redux";
//import DateTimePicker from '@react-native-community/datetimepicker';
import {getItems,getLocation,updatedCart,getHomescreenData,getOrderDetailsData} from "../../../actions/itemsAction";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from "react-native-simple-radio-button";
import { TextInput } from "react-native-gesture-handler";
import Loader from "../Loader";

const CheckOutScreen = (props) => {
  const [loading,setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [finalDate,setFinalDate] = useState("");
  const [finalTime,setFinalTime] = useState("");
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  var [value,changeRadioValue] = useState("08:00 - 10:00");
  var [cartItemsArray,changeCartItemsArray] = useState(props.item.cartItems);
  var [newCartArray,changeNewCartArray] = useState([]);
  var [radio_props,changeRadioProps] = useState([
      // {label: '08:00 - 10:00', value: "08:00 - 10:00" },
      // {label: '10:00 - 13:00', value: "10:00 - 13:00" },
      // {label: '13:00 - 16:00', value: "13:00 - 16:00" },
      // {label: '16:00 - 19:00', value: "16:00 - 19:00" },
      // {label: '19:00 - 22:00', value: "19:00 - 22:00" }
  ]);

  useEffect(() => {
    // Update the user data
    var currentDate = new Date();
    var choosenDate=`${currentDate.getFullYear()}-${('0' + (currentDate.getMonth()+1)).slice(-2)}-${('0' + (currentDate.getDate())).slice(-2)}`;
    _getTimings(choosenDate);
    
  }, [])

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
            var tempArray=[];
            result.data.map(time => {
              tempArray.push({label: time, value: time})
              })
            changeRadioProps(tempArray);
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

  const subtotalPrice = () => {
	    // const { cartItems } = cartItems;
	    if(cartItemsArray){
	    	return cartItemsArray.reduce((sum, item) => sum +  props.item.deliveryData.del_charge + (item.qty * item.price), 0 );
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
    if(props.item.userdata.user_id === undefined)
    {
        return(<View>{props.navigation.navigate("Auth")}</View>)
        
    }
    else
    {
        return(
            <View style={{height:"100%"}}>
                <ScrollView>
                    <View style={{width:"95%",marginLeft:"auto",marginRight:"auto",backgroundColor:"white",borderRadius:7,marginTop:20,marginBottom:20,elevation:10,padding:10}}>
                        {props.item.userAddressData.map((address)=>{
                                if(address.select_status === 1)
                                {
                                    return(
                                    <View 
                                        key={address.address_id}
                                        style={{width:"95%",marginLeft:"auto",marginRight:"auto",marginBottom:15}}>
                                        <Text style={{fontWeight:"bold"}}>Name:- {address.receiver_name}</Text>
                                        <Text style={{color:"#7f7f7f"}}>Address:- {address.house_no}-{address.society},{address.landmark},{address.city},{address.state}-{address.pincode}</Text>
                                        <Text style={{color:"#7f7f7f"}}>Contact:- {address.receiver_phone}</Text>
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
                        <TouchableOpacity
                         onPress={()=> props.navigation.navigate("AddressScreen")}
                         style={{backgroundColor:"#062FFF",borderRadius:10,width:"95%",marginBottom:10,marginLeft:"auto",marginRight:"auto",padding:10,alignItems:"center"}}>
                            <Text style={{color:"white"}}>Change or Add address</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={{flexDirection:"row"}}>
                        <ScrollView horizontal={true}
                            showsVerticalScrollIndicator ={false}
                            showsHorizontalScrollIndicator={false}>
                            {cartItemsArray.map(item => {
                                return(
                                    <TouchableOpacity key={item.varient_id} >
                                    <View style={styles.trendingView}>
                                        <View style={{flex: 1}}>
                                          <Image
                                            source={{
                                              uri:
                                                'http://justcomfort.umbeo.com/admin/' + item.product_image,
                                            }}
                                            style={styles.trendingImageStyle}
                                          />

                                        </View> 
                                        <View style={{flex: 1}}>
                                          <Text style={{flex: 1, fontSize: 15, margin: 5}}>
                                              {item.product_name}
                                          </Text>
                                        </View>
                                        <View style={{flex: 1}}>
                                          <Text style={{flex: 1, fontSize: 12, margin: 5}}>
                                              Unit: {item.unit}
                                          </Text>
                                        </View>
                                        <View style={{flex: 1}}>
                                          <Text style={{flex: 1, fontSize: 15, margin: 5}}>
                                              {props.item.currency_sign} {item.price}
                                          </Text>
                                        </View>
                                        <View style={{flex: 1}}>
                                          <Text style={{flex: 1, textAlign: "right"}}>
                                              {item.mrp} <Text style={{flex: 1, textAlign: "right", color: 'green', fontSize: 12}}>{props.item.currency_sign}{item.mrp - item.price} Off</Text>
                                          </Text>
                                        </View>
                                      </View>
                                </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View> */}
                    <View style={{width:"95%",elevation:10,marginLeft:"auto",marginRight:"auto",marginTop:30,marginBottom:20,padding:5,paddingTop:20,paddingBottom:20, backgroundColor:"white",borderRadius:10}}>
                        <View>
                          <View>
                            <View style={{flexDirection:"column",marginBottom:10}}>
                              <View style={{flex:1}}>
                                <Text style={{color:"black",flex:1,marginBottom:10,width:"90%",marginLeft:"auto",marginRight:"auto"}}>Current Selected Date for Delivery:- </Text>
                              </View>
                              <View style={{flex:1}}>
                                <View style={{flexDirection:"row",width:"95%",marginLeft:"auto",marginRight:"auto"}}>
                                  <Text style={styles.dateHead}>Date</Text>
                                  <Text style={styles.dateHead}>Month</Text>
                                  <Text style={styles.dateHead}>Year</Text>
                                </View>
                                <View style={{flexDirection:"row",width:"95%",marginLeft:"auto",marginRight:"auto"}}>
                                  <Text style={styles.dateStyle}>{('0' + (date.getDate())).slice(-2)}</Text>
                                  <Text style={styles.dateStyle}>{('0' + (date.getMonth()+1)).slice(-2)}</Text>
                                  <Text style={styles.dateStyle}>{date.getFullYear()}</Text>
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


                    <View style={{width:"95%",elevation:10,marginLeft:"auto",marginRight:"auto",marginTop:30,marginBottom:20,padding:5,paddingTop:20,paddingBottom:30, backgroundColor:"white",borderRadius:10}}>
                      <View style={{width:"95%",marginLeft:"auto",marginRight:"auto"}}>
                          <Text>Number of Cart Items ( {cartItemsArray.length} )</Text>
                          <View style={{flexDirection:"row",marginTop:7,marginBottom:10,width:"98%",marginLeft:"auto",marginRight:"auto"}}>
                              <View style={{marginTop:10,marginBottom:10,width:"50%"}}>
                                <Text style={{color:"#7f7f7f"}}>Order Amount:-</Text>
                                <Text style={{color:"#7f7f7f"}}>Delivery Charges:-</Text>
                                <Text style={{color:"#7f7f7f",marginTop:2}}>Total Payable Amount:-</Text>
                              </View>
                              <View style={{marginTop:10,marginBottom:10,alignItems:"flex-end",width:"50%"}}>
                                <Text style={{color:"#7f7f7f"}}>{props.item.currency_sign}{subtotalPrice().toFixed(2)}</Text>
                                <Text style={{color:"#7f7f7f",borderBottomColor:"grey",borderBottomWidth:1}}>{props.item.currency_sign}{props.item.deliveryData.del_charge}.00</Text>
                                <Text style={{color:"#7f7f7f",marginTop:2}}>{props.item.currency_sign}{(subtotalPrice()+20.00).toFixed(2)}</Text>
                              </View>
                          </View>
                      </View>
                      {/* <View style={{width:"95%",marginLeft:"auto",marginRight:"auto",marginTop:10}}>
                          <Text style={{color:"black"}}>Do you have a Referal Code:-</Text>
                          <View style={{flexDirection:"row"}}>
                              <TextInput
                                  style={{flex:3,width:"50%",borderColor:"grey",borderBottomWidth:1}} 
                                  placeholder="Enter the code here"/>
                              <TouchableOpacity style={{flex:1,borderRadius:10,backgroundColor:"#062FFF",width:"100%",marginLeft:"auto",marginRight:"auto",padding:10,alignItems:"center"}}>
                                  <Text style={{color:"white"}}>Check</Text>
                              </TouchableOpacity>
                          </View>
                      </View> */}
                    </View>
                    
                </ScrollView>
                <View style={{flexDirection:"row",position:"relative",bottom:0,marginTop:7,marginBottom:7,backgroundColor:"white"}}>
                    <View style={{flex:2,borderRadius:10}}>
                        <Text style={{marginLeft:10,fontWeight:"bold",fontSize:15}}>Price Detail's</Text>
                        <Text style={{marginLeft:10,fontWeight:"bold",fontSize:15,color:"grey"}}>{props.item.currency_sign} {(subtotalPrice()+TaxesPrice()+20.00).toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={()=> 
                          {
                            if(radio_props.length === 0)
                            {
                              Alert.alert("Please Choose a Valid Delivery Date!!")
                            }
                            else
                            {
                              var data = {
                                orderDate:finalDate,
                                orderTime:value
                              }
                              console.log("data for getorderdetailsdata is :-"+JSON.stringify(data))
                              props.getOrderDetailsData(data);
                              props.navigation.navigate("PaymentOptions")
                            }
                          }}
                        style={{flex:1,backgroundColor:"#062FFF",width:"100%",marginLeft:"auto",marginRight:"auto",padding:10,alignItems:"center",borderRadius:10,marginRight:8}}>
                        <Text style={{color:"white"}}>Checkout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
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
  export default connect(mapStateToProps, {getItems,getLocation,updatedCart,getHomescreenData,getOrderDetailsData})(CheckOutScreen);

  const styles = StyleSheet.create({
    container:{
      flex:1,
      backgroundColor:'#F2EDED',
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
    noItemsContainer:{
      flex:1,
      backgroundColor:'#F7F4F6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    horizontalScrollview: {
      height: 60,
    },
    textStyles:{
      backgroundColor: '#FFFFFF',
      marginTop: 10,
      marginBottom: 10,
      marginLeft: 7,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding:10,
      borderRadius: 7,
    },
    SectionStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderWidth: 0.5,
      borderColor: '#000',
      height: 40,
      borderRadius: 5,
      margin: 10,
    },
    inputStyle: {
      flex: 1,
      color: '#000000',
      paddingLeft: 5,
      paddingRight: 5,
      height: 40,
    },
    keyIcon:{
      padding: 5,
      margin: 5,
    },
    imageStyle: {
      padding: 10,
      margin: 5,
      resizeMode: 'stretch',
      alignItems: 'center',
      width: 350,
      height: 150,
    },
    tabviewContainer:{
      backgroundColor: '#F2EDED',
      color: '#000000',
    },
    tabviewTextStyle:{
      fontSize: 11,
      margin: 8,
      color: '#000',
    },
    tabContent: {
      color: '#444444',
      fontSize: 18,
      margin: 24,
    },
    trendingHorizontalScrollview: {
      margin: 5,
      padding: 5,
      paddingTop: 0,
    },
    trendingView:{
      flex: 1, 
      backgroundColor: '#FFFFFF', 
      borderRadius: 7, 
      marginRight: 8,
      width:172
    },
    trendingParentView: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: 30,
      height: 30,
      margin: 5,
      backgroundColor: '#062FFF',
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      borderRadius: 7,
    },
    trendingImageStyle:{
      padding: 10,
      margin: 5,
      borderRadius: 15,
      resizeMode: 'stretch',
      alignItems: 'center',
      width: 160,
      height: 120,
    },
    productBasicView:{
      margin: 5,
      textAlign: "left",
      color: '#000000', 
      fontSize: 17
    },
    productViewMore:{
      textAlign: "right", 
      alignItems: 'flex-end',
      right: 0,
      color: '#000000', 
      margin: 5,
      fontSize: 15
    },
    categorySection:{
      backgroundColor: '#FFFFFF',
      marginTop: 5,
    },
    trendingCategoryView:{
      flex: 1, 
      backgroundColor: '#F2EDED', 
      borderRadius: 7, 
      marginRight: 8,
      marginTop: 3,
      padding: 7,
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
    rechargebutton: {
      backgroundColor: '#062FFF',
      borderWidth: 0,
      color: '#FFFFFF',
      borderColor: '#7DE24E',
      height: 40,
      alignItems: 'center',
      borderRadius: 15,
      marginLeft: 35,
      marginRight: 35,
      top: 100,
      marginBottom: 25,
      width: 250,
    },
    textRecharge: {
      color: '#FFFFFF',
      paddingVertical: 10,
      fontSize: 16,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    spinnerView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
  });