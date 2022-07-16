// Example of Splash, Login and Sign Up in React Native
// http://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React,{useState,useEffect} from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';

const CartScreen = () => {
  var [data,setData] = useState ("");
  useEffect(() => {
    // Update the user data
   
    getAboutUsData();
  }, [])

  const getAboutUsData = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("http://justcomfort.umbeo.com/admin/api/appaboutus", requestOptions)
      .then(response => response.json())
      .then(result => setData(result.data))
      .catch(error => console.log('error', error));
  }
  return (
    // <SafeAreaView style={styles.container}>
    //   <View style={styles.items}>
    //     <Text style={styles.itemstext}>
    //       {data.title}
    //     </Text>
        
    //   </View>
      <WebView
        originWhitelist={['*']}
        source={{ html: data.description }}
      />
    // {/* </SafeAreaView> */}
  );
};

export default CartScreen;

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
  }
});