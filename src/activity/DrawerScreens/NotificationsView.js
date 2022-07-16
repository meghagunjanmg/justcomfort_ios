import React, { useState,useEffect } from 'react';
import {
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ListEmptyComponent,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 

import {connect} from "react-redux";
import {updateUserdetails,UpdateNotifyByData} from "../../actions/itemsAction";
import { Button } from 'react-native-paper';

const NotificationsView = (props) => {
const [data, setData] = useState([]);
const [refreshing, setRefreshing] = useState(false);

const userId="0";
useEffect(() => {
  getData()    
  }, [])

  const onRefresh = () => {
    //Call the Service to get the latest data
    getData();
  };

  const getData = () => {
    
    let dataToSend = {user_id: props.item.userdata.user_id};
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    
    fetch('http://justcomfort.umbeo.com/admin/api/notificationlist', {
      method: 'POST',
      body: formBody,
      headers: {
        //Header Defination
        'Content-Type':
        'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
        setData(responseJson.data);
        console.log(responseJson.data);
    })
    .catch((error) => {
        console.error(error);
    });
  };

const deleteAll = () => {
    let dataToSend = {user_id: props.item.userdata.user_id};
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    
    fetch('http://justcomfort.umbeo.com/admin/api/delete_all_notification', {
      method: 'POST',
      body: formBody,
      headers: {
        //Header Defination
        'Content-Type':
        'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      setData(data[0])
    })
    .catch((error) => {
        console.error(error);
    });
}
    return (
        <View style={styles.container}>

          {
            data==0?
            
                <View style={styles.container}>
<Text style={styles._1}> You do not have any notification</Text>
</View>
                
        :
              <View>
                          <TouchableOpacity onPress={() => deleteAll()}>
  <Button style={{alignItems: 'flex-end'}}>
  Delete All
  </Button>
     </TouchableOpacity>
          <FlatList 
            style={styles.notificationList} 
            enableEmptySections={true}
            data={data}
            refreshControl={
              <RefreshControl
                //refresh control used for the Pull to Refresh
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            keyExtractor= {(item) => {
              return item.id;
            }}
            renderItem={({item}) => {
              return (
                <View style={styles.notificationBox}>
                  <Text style={styles.title}>{item.noti_title}</Text>
                  <Text style={styles.description}>{item.noti_message}</Text>
                </View>
              )}}/>
              </View>
}
</View>
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
  export default connect(mapStateToProps, {updateUserdetails,UpdateNotifyByData})(NotificationsView);
  const styles = StyleSheet.create({
    container:{
      backgroundColor:'#DCDCDC'
    },
    notificationList:{
      marginTop:20,
      padding:10,
    },
    notificationBox: {
      padding:20,
      marginTop:5,
      marginBottom:5,
      backgroundColor: '#FFFFFF',
      borderRadius:10,
    },
    icon:{
      width:45,
      height:45,
    },
    title:{
      fontSize:16,
      color: "#000000",
      marginLeft:10,
      fontWeight: 'bold'
    },
    no:{
        fontSize:16,
        color: "#000000",
        marginLeft:10,
        flex:1,
        fontWeight: 'bold'
      },
    description:{
        fontSize:14,
        color: "#000000",
        marginLeft:10,
      },

  
  container: {
    backgroundColor:'white',
    alignItems:'center',
    justifyContent:'center',
    flex:1,
    paddingTop:20 //this amount should be equal to the header height so that any items displayed inside the container will start after the absolute positioned header
},
 _1: {
    backgroundColor: 'white',
    fontSize:16,
    alignSelf: 'center',
    justifyContent:"flex-start",
    alignItems: 'center',
    position:"absolute",
    top:0
}    
});