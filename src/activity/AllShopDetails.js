import {TouchableOpacity,StyleSheet,View,Text,SafeAreaView,FlatList,Image} from "react-native";
import React, {useState, useEffect, createRef} from "react";

const data = [{
    cat_id:1,
    title:"Shop Rite",
    image:"http://img1.pnghut.com/13/11/8/bDsX91DUB2/marketplace-sign-supermarket-shopping-wakefern-food-corporation.jpg",
    description:"shop desciption"
},
{
    cat_id:2,
  
    title:"Fresh Supermarket",
    image:"http://img.freepik.com/free-vector/shopping-cart-supermarket-logo-template_23-2148470295.jpg",
    description:"shop desciption"

},
{
    cat_id:3,
    title:"Grocery to Go",
    image:"http://images-platform.99static.com/TW7J39dkXVhsnDTmXxFgMo5j8iI=/0x0:1440x1440/500x500/top/smart/99designs-contests-attachments/68/68732/attachment_68732289",
    description:"Shop Description"

}
]

const AllShopDetails = (props) => {
    
  console.error(props.route.params.id);
    // const [data, setData] = useState('');

    // fetch("http://justcomfort.umbeo.com/admin/api/catee")
    // .then(res => res.json())
    // .then(res => {
    //     setData(res.data)
    // })
    // .catch(error => {
    // });
  
  return (
    <SafeAreaView style={styles.container}>

      <FlatList
        data={data}
        renderItem={({ item }) =>
        <View>
            <TouchableOpacity 
            onPress={() => {
                //alert("clicked"+item.title);
                props.navigation.navigate("DrawerNavigationRoutes")
            }
            }
            style={styles.listItem}>
            <Image source={{uri: item.image}}  style={{width:60, height:60,borderRadius:30}} />
            <View style={{alignItems:"center",flex:1}}>
              <Text style={{fontWeight:"bold"}}>{item.title}</Text>
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
  export default AllShopDetails;
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