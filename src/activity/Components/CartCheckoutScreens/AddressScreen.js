//React Native Swipe Down to Refresh List View Using Refresh Control
//http://aboutreact.com/react-native-swipe-down-to-refresh-listview-using-refreshcontrol/

//import React in our code
//import all the components we are going to use
import {
  FlatList} from 'react-native';
import AddressScreen_x from './AddressScreen_x';
import React,{useState,useEffect} from "react";
import {  RefreshControl, StyleSheet, SafeAreaView, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import {connect} from "react-redux";
import {getItems,getLocation,updatedCart,getHomescreenData,getUserAddress} from "../../../actions/itemsAction";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from "react-native-simple-radio-button";
import { TextInput } from "react-native-gesture-handler";
import Toast from 'react-native-simple-toast';

const AddressScreen = (props) => {
  const [refreshing, setRefreshing] = useState(true);
  const [dataSourc, setDataSourc] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    
      console.log(props.item.userdata.user_id+"\n"+props.item.userdata.user_name);
       var formdata1 = new FormData();
       formdata1.append("user_id", props.item.userdata.user_id);
       formdata1.append("store_id",  props.item.homepageData.recent_selling[0].store_id);
       var requestOptions = {
         method: 'POST',
         body: formdata1,
         redirect: 'follow'
       };
       
       fetch("http://justcomfort.umbeo.com/admin/api/show_address", requestOptions)
       .then((response) => response.json())
       .then((responseJson) => {
         setRefreshing(false);
         setDataSourc(responseJson.data);
         var item;
         const datas = [];
         for(var i=0;i<responseJson.data.length;i++)
    {
      item = responseJson.data[i];
                var ad = (item.house_no+","+item.society+","+item.city+","+item.state+","+item.pincode).replace("undefined","").replace(",,",",")
                console.log(ad);
                var newObj = { // Change your required detail here
                  receiver_name: item.receiver_name,
                  receiver_phone: item.receiver_phone,
                  address_id: item.address_id,
                  address: ad,
                  select_status:item.select_status   
              }
                datas.push(newObj)
              }
            
            setDataSource(datas);

         console.log(datas);
       })
       .catch((error) => {
         console.error(error);
       });
  };
  const handleChangeAddress = (address_id) => {
    var formdata = new FormData();
    formdata.append("address_id", address_id);

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    fetch("http://justcomfort.umbeo.com/admin/api/select_address", requestOptions)
      .then(response => response.json())
      .then(async result => {
          console.log(result)
          if(result.status === "1")
            {
                Toast.show("Address Selected Successfully!!");
                getData();
                props.navigation.navigate("CartScreen");

            }
          else
            props.navigation.navigate("CartScreen");
        })
      .catch(error => {
            console.log('Error from change address api', error);
            Toast.show("We are encountring error while updating data!!");
        });
}

const handleDeleteAddress = (address_id) => {
  var formdata = new FormData();
  formdata.append("address_id", address_id);

  var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };

  fetch("http://justcomfort.umbeo.com/admin/api/remove_address", requestOptions)
    .then(response => response.json())
    .then(async result => {
        console.log(result)
        if(result.status === "1")
          {
              Toast.show("Address Deleted Successfully!!");
              getData();
          }
        }
    )
        .catch(error => {
          console.log('Error from change address api', error);
          Toast.show("We are encountring error while updating data!!");
      });

    }

  const ItemView = ({item}) => {
    return(<View key={item.address_id} style={{width:"95%",marginLeft:"auto",marginRight:"auto",backgroundColor:"white",borderRadius:7,marginTop:20,marginBottom:20,elevation:10,padding:10}}>
    <View style={{width:"95%",marginLeft:"auto",marginRight:"auto",marginBottom:15}}>
        <Text style={{fontWeight:"bold"}}>Name:- {item.receiver_name}</Text>
        <Text style={{color:"#7f7f7f"}}>Address:- {item.address}</Text>
        <Text style={{color:"#7f7f7f"}}>Contact:- {item.receiver_phone}</Text>
    </View>
    <TouchableOpacity style={{backgroundColor:"#238A02",width:"95%",marginBottom:10,marginLeft:"auto",marginRight:"auto",padding:10,alignItems:"center",borderRadius:10}}
     onPress={()=> props.navigation.navigate("AddAddressScreen", {selectedAddress: item.address_id})}>
        <Text style={{color:"white"}}>Change Address</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{backgroundColor:"#238A02",width:"95%",marginBottom:10,marginLeft:"auto",marginRight:"auto",padding:10,alignItems:"center",borderRadius:10}}
     onPress={()=> handleDeleteAddress(item.address_id)}>
        <Text style={{color:"white"}}>Delete Address</Text>
    </TouchableOpacity>

    {item.select_status !== 1 && <TouchableOpacity style={{borderColor:"#238A02",borderWidth:1,width:"95%",marginBottom:10,marginLeft:"auto",marginRight:"auto",padding:10,alignItems:"center",borderRadius:10}}
     onPress={()=> handleChangeAddress(item.address_id)}>
        <Text style={{color:"#238A02"}}>Select this Address</Text>
    </TouchableOpacity>}
</View>);
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8'}} 
      />
    );
  };

  const getItem = (item) => {
    //Function for click on an item
    alert('Id : ' + item.address_id + ' Title : ' + item.house_no);
  };

  const onRefresh = () => {
    //Clear old data of the list
    setDataSource([]);
    //Call the Service to get the latest data
    getData();
  };
  return (
    <SafeAreaView style={{flex: 1}}>
           <TouchableOpacity style={{marginTop:20,backgroundColor:"#238A02",width:"95%",marginLeft:"auto",marginRight:"auto",padding:10,alignItems:"center",borderRadius:10}}
             onPress={()=> props.navigation.replace("AddAddressScreen", {selectedAddress: "",index:null})}
            >
                <Text style={{color:"white"}}>Add New Address</Text>
            </TouchableOpacity>
      <View style={styles.container}>
        {refreshing ? <ActivityIndicator /> : null}
        <FlatList
          data={dataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          enableEmptySections={true}
          renderItem={ItemView}
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    marginTop: 10,
  },
  itemStyle: {
    fontSize: 20,
    padding: 10,
  },
});

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
  export default connect(mapStateToProps, {getItems,getLocation,updatedCart,getHomescreenData,getUserAddress})(AddressScreen);