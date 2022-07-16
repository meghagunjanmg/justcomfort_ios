import {TouchableOpacity,StyleSheet,View,Text,SafeAreaView,FlatList,Image,ToastAndroid,PermissionsAndroid} from "react-native";
import React, {useState, useEffect, createRef} from "react";
import {_storeData, _retrieveData} from "./Storage";
import * as Location from 'expo-location';
import Geolocation from '@react-native-community/geolocation';



const data = [{
    cat_id:1,
    title:"Grocery",
    image:"http://upload.wikimedia.org/wikipedia/commons/1/13/Supermarkt.jpg",
    description:"To buy Fresh Fruits & Vegetable"
},
{
    cat_id:2,
    title:"Bakery",
    image:"http://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Strawberry_cupcakes_%286092771387%29.jpg/1024px-Strawberry_cupcakes_%286092771387%29.jpg",
    description:"To buy Fresh Bakery items"

},
{
    cat_id:3,
    title:"Fashion",
    image:"http://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Pelz-Verkaufsstand_in_Tallinn%2C_Estland.jpg/220px-Pelz-Verkaufsstand_in_Tallinn%2C_Estland.jpg",
    description:"To buy Fashionable Clothes"

},
{
    cat_id:4,
    title:"Medicines",
    image:"http://upload.wikimedia.org/wikipedia/commons/thumb/5/55/VariousPills.jpg/800px-VariousPills.jpg",
    description:"To buy Medicines"

},
{
    cat_id:5,
    title:"Home Appliances",
    image:"http://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Breville.jpg/800px-Breville.jpg",
    description:"To buy Home Appliances"

}

]

const ShopCategories = (props) => {
  var [latitude,changeLati] = useState(null);
  var [longitude,changeLongi] = useState(null);
    // const [data, setData] = useState('');

    // fetch("http://justcomfort.umbeo.com/admin/api/catee")
    // .then(res => res.json())
    // .then(res => {
    //     setData(res.data)
    // })
    // .catch(error => {
    // });
  
    _getLocationAsync();


 
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) =>
        <View>
            <TouchableOpacity 
            onPress={() => {
                //alert("clicked"+item.title);
                props.navigation.navigate("AllShopDetails", {screen: "AllShopDetails", params: {id: 1}})
            }
            }
            style={styles.listItem}>
            <Image source={{uri: item.image}}  style={{width:60, height:60,borderRadius:30}} />
            <View style={{alignItems:"center",justifyContent:'center',flex:1}}>
              <Text style={{fontWeight:"bold",alignContent:'center',fontSize:16}}>{item.title}</Text>
              <Text>{item.description}</Text>
            </View>
        
          </TouchableOpacity>
          </View>
        }
        
        keyExtractor={item => item.cat_id}
      />
    </SafeAreaView>
  );
}


_getLocationAsync = async () => {
  console.log("get lacation async called")
  
  try {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        position => {
          const latitude = JSON.stringify(position.coords.latitude);
          const longitude = JSON.stringify(position.coords.longitude);
  remove("lat")
  remove("lng")
        _storeData("lat",latitude+"");
        _storeData("lng",longitude+"");
    
        },
        error => Alert.alert('Error', JSON.stringify(error)),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    
      );

    }
    else {
       
    }
}
catch (err) {
    console.warn(err)
}
}


const remove =async (key) =>{
  try {
      await AsyncStorage.removeItem(key);
      return true;
  }
  catch(exception) {
      return false;
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
  export default ShopCategories;
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
        marginTop:60
      },
      listItem:{
        margin:10,
        padding:10,
        backgroundColor:"#FFF",
        width:"80%",
        flex:1,
        alignSelf:"center",
        flexDirection:"row",
        borderRadius:5
      },
      item: {
        backgroundColor: '#062FFF',
        padding: 8,
        marginVertical: 8,
        marginHorizontal: 8,
      },
      title: {
        fontSize: 18,
      },
      image :{
        width: 25,
        height:25,
        margin: 8,
        alignItems: "center"
      },
  });