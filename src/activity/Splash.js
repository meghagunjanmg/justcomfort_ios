// Import React and Component
import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image
} from 'react-native';

import {connect} from "react-redux";
import {getCurrency,getUserData, getNotifyByData} from "../actions/itemsAction";

import AsyncStorage from '@react-native-community/async-storage';

const Splash = (props) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    console.log("In splash Screen>>> ");
    readData();
  }, []);

  const readData = async () => {
    try {
      const value = await AsyncStorage.getItem('userId');
      if(value !== null){
        console.log("values are from storage data in splash.js  >>> " + value);  
        readUserDetails(value);
      }else{
        props.navigation.replace('Auth');
      }
    } catch (e) {
      console.log('Failed to fetch the data from storage');
    }
  }

  const readUserDetails = (userId) => {
    let dataToSend = {user_id: userId};
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch('http://justcomfort.umbeo.com/admin/api/myprofile', {
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
        //Hide Loader
        // If server response message same as Data Matched
        if (responseJson.status === '1') {
          props.getUserData(responseJson.data);
        } else {
          setErrortext(responseJson.message);
          console.log('Please check your email id or password');
        }
      })
      .catch((error) => {
        //Hide Loader
        console.error(error);
      });

      var requestOptions = {
        method: 'POST',
        body: formBody,
        redirect: 'follow'
      };
      
      fetch("http://justcomfort.umbeo.com/admin/api/notifyby", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === '1') {
          props.getNotifyByData(result.data);
        } else {
          setErrortext(result.message);
          console.log('Please check your API.. ' + result.message);
        }
      })
      .catch(error => console.log('error', error));

     /* var formdata1 = new FormData();
      formdata1.append("user_id", userId);
      formdata1.append("store_id", "3");

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
          }else{
            setErrortext(result.message);
            console.log('Please check your API.. ' + result.message);
          }
        })
        .catch(error => console.log('error', error));
      
        */
      
      fetch("http://justcomfort.umbeo.com/admin/api/currency", {method: 'GET'})
      .then(response => response.json())
      .then(result => {
        console.log('Please check your API.. currency ' + result);

        if (result.status == '1'){
          props.getCurrency(result.data.currency_name, result.data.currency_sign);
          console.log('Please check your API.. currency ' + result.data.currency_sign);
          props.navigation.replace('DrawerNavigationRoutes');
        }else{
          setErrortext(result.message);
          console.log('Please check your API.. currency ' + result.data.currency_sign);
        }
      })
      .catch(error => console.log('Please check your API.. currency ' +error));
      
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/ic_launcher.png')}
        style={{width: '90%', resizeMode: 'contain', margin: 30}}
      />
      <ActivityIndicator
        animating={animating}
        color="#FFFFFF"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};

const mapStateToProps = (state) => {
  return({
      item:state.item
  })
}

export default connect(mapStateToProps, {getCurrency, getUserData, getNotifyByData})(Splash);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});