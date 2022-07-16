import React, {useState, useEffect} from "react";
import MapView, { Marker } from 'react-native-maps';
import ViewMoreText from 'react-native-view-more-text';

import {StyleSheet, 
  Dimensions,
  View,
  Text, 
  SafeAreaView, 
  ScrollView, 
  TextInput,
  Image, 
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Share,
  ToastAndroid
} from 'react-native';
import { EvilIcons, FontAwesome } from '@expo/vector-icons'; 
import SegmentedControlTab from 'react-native-segmented-control-tab';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from "react-redux";
import {getItems,getLocation,updatedCart,getHomescreenData,getAllProducts, getCurrency,getDeliveryData, getUserData, getNotifyByData,getStoreId} from "../../actions/itemsAction.js";
import { MaterialIcons } from '@expo/vector-icons';

import {_storeData, _retrieveData} from "../Storage";

const Homescreen = (props) => {
  if(props.item.userdata.first_name !== undefined){
    customTitle = `Welcome ${props.item.userdata.first_name} !`;
  }
  else   customTitle = `Welcome !`;

  props.navigation.setOptions({title: customTitle})
  
  var [allProducts,changeAllProducts] = useState([]);
  var [errorMsg,changeErrorMsg] = useState("");
  var [responseStatus,changeResponseStatus] = useState("");
  var [responseStatusProduct,changeResponseStatusProduct] = useState("");
  var [locationResult,changeLocationResult] = useState("");
  var [search,changeSearch] = useState("");
  var [latitude,changeLati] = useState(null);
  var [longitude,changeLongi] = useState(null);
  var [loading,changeloading] = useState(true);
  var [customStyleIndex,changeCustomStyleIndex] = useState(0);
  var [categoryId,changeCategoryId] = useState(0);
  var [topCategories,changeTopCategory] = useState([]);
  var [banner1,changeBanner1] = useState([]);
  var [banner2,changeBanner2] = useState([]);
  var [trendingOffer,changetrendingOffer] = useState([]);


  var [trendingItems,changeTrendingItems] = useState([]);
  var [featuredItems,changeFeaturedItems] = useState([]);
  var [recommendedItems,changeRecommendedItems] = useState([]);
  var [responseProductData,changeResponseProductData] = useState([]);
  var [responseProductDataArray,changeResponseProductDataArray] = useState([]);
  var [cartItemsArray,changeCartItemsArray] = useState(props.item.cartItems);
  var [reload,setReload] = useState();
  var [storeNumber,setStoreNumber] = useState("");
  var [plusButtons,changePlusButton] = useState(false);
  const [refreshPage, setRefreshPage] = useState("");

  quantityHandler = (action, partOf, desc,index, childIndex) => {
    //1-> we have to check the codition of more or less
    //2-> we need to find weather the item is already in the cart
    //3-> if yes increment the quantity in cart as well as in parOf like trending item or what as well as deceare the total quantity in partOf
    //4-> if not-> add the item to cart and increase the quantity demanded in PartOf
    
    //part 1
    console.log("Quantity handler called")
    if(action == 'more')
    {
      console.log(`The Action is More`);
      console.log(`Items in cart are : ${cartItemsArray}`);
      // const indexInCart = cartItemsArray.findIndex(element => element.description === desc); //finding index of the item
      var indexInCart = null;
      for(var i=0;i<cartItemsArray.length;i++)
        if(cartItemsArray[i].description === desc)
          indexInCart = [i];
      console.log(`Index is:- ${indexInCart}`);
      //If Item is not present in cart-> then push it to the cart
      if(indexInCart === null)
      {
        console.log(`PartOf is :- ${partOf}`)
        var tempArray=cartItemsArray;
        var dataToBePushed = allProducts[index];
        dataToBePushed.qty = dataToBePushed.qty+1;
        tempArray.push(dataToBePushed);
        changeCartItemsArray(tempArray);
        props.updatedCart(cartItemsArray,partOf,desc);
        console.log(`now the cart item are:- ${cartItemsArray} with qty :- ${cartItemsArray[0].qty}`)
        //Updating the PartOf qty of that item
        console.log(`Item is :- ${allProducts[index].description} with Qty :- ${allProducts[index].qty} and TotalQuantity :- ${allProducts[index].quantity}`);
        tempArray=allProducts;
        //tempArray[index].qty = tempArray[index].qty + 1;
        tempArray[index].quantity = tempArray[index].quantity-1;
        changeAllProducts(tempArray);
        props.getAllProducts(allProducts);
        console.log(`Item is :- ${allProducts[index].description} with Qty :- ${allProducts[index].qty} and TotalQuantity :- ${allProducts[index].quantity}`);
        console.log(`now the cart item are:- ${cartItemsArray} with qty :- ${cartItemsArray[0].qty}`)
        console.log("");
        
      }
      //Item is already present in cart -> then update the qty
      else
      {
        //Updating the Cart's qty of that item
        console.log(`Item ${cartItemsArray[indexInCart].description} already present with qty = ${cartItemsArray[indexInCart].qty}`)
        var updateQty = cartItemsArray[indexInCart].qty;
        updateQty= updateQty + 1;
        var tempArray = cartItemsArray;
        tempArray[indexInCart].qty = updateQty; 
        changeCartItemsArray(tempArray);
        props.updatedCart(cartItemsArray,partOf,desc);
        console.log(`New Qty is = ${cartItemsArray[indexInCart].qty}`)

        //new added here
        console.log(`Item is :- ${allProducts[index].description} with Qty :- ${allProducts[index].qty} and TotalQuantity :- ${allProducts[index].quantity}`);
          tempArray=allProducts;
          tempArray[index].qty = updateQty;
          tempArray[index].quantity = tempArray[index].quantity-1;
          changeAllProducts(tempArray);
          props.getAllProducts(allProducts);
          console.log(`Item is :- ${allProducts[index].description} with Qty :- ${allProducts[index].qty} and TotalQuantity :- ${allProducts[index].quantity}`);
          console.log(`now the cart item are:- ${cartItemsArray} with qty :- ${cartItemsArray[indexInCart].qty}`)
          console.log("");
      }

		} 
    else if(action == 'less')
    {
      console.log(`The Action is Less`);
      //Finding index in cart
      var indexInCart = null;
      for(var i=0;i<cartItemsArray.length;i++)
        if(cartItemsArray[i].description === desc)
          indexInCart = [i];
      console.log(`Index is:- ${indexInCart}`);
      //Updating the Cart's qty of that item
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

      //new Added Here
      console.log(`Item is :- ${allProducts[index].description} with Qty :- ${allProducts[index].qty} and TotalQuantity :- ${allProducts[index].quantity}`);
      tempArray=allProducts;
      tempArray[index].qty = updateQty;
      tempArray[index].quantity = tempArray[index].quantity + 1;
      changeAllProducts(tempArray);
      props.getAllProducts(allProducts);
      console.log(`Item is :- ${allProducts[index].description} with Qty :- ${allProducts[index].qty} and TotalQuantity :- ${allProducts[index].quantity}`);
      // console.log(`now the cart item are:- ${cartItemsArray} with qty :- ${cartItemsArray[indexInCart].qty}`)
      console.log("");
      //Updating the Cart's qty of that item
      
		}
  }

  useEffect(() => {
    // Update the user data
    console.log("checking in home page for user id");
    readUserData();
    console.log("checking in home page >>> ");
    _getLocationAsync();
    //newloc()

    _getHomePageDataAsync();
    
    //props.navigation.replace('DrawerNavigationRoutes');
  }, [allProducts])


  const readUserData = async () => {
    try {
      const valueuserId = await AsyncStorage.getItem('userId');
      storeNumber = await AsyncStorage.getItem('storeNumber');

      console.log("values of user id in homepage  >>> " + valueuserId); 
      if(valueuserId !== null){
        readUserDetails(valueuserId);
      } 
    
    } catch (e) {
      console.log('Failed to fetch the data from storage')
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
        console.error("1"+error);
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
      
      
      fetch("http://justcomfort.umbeo.com/admin/api/currency", {method: 'GET'})
      .then(response => response.json())
      .then(result => {
        if (result.status === '1'){
          props.getCurrency(result.data.currency_name, result.data.currency_sign);
        }else{
          setErrortext(result.message);
          console.log('Please check your API.. ' + result.message);
        }
      })
      .catch(error => console.log('error', error));
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

  _getLocationAsync = async () => {
    console.log("get lacation async called")
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') 
    {
      changeLocationResult("Permission to access location was denied");
      setError('Permission to access location was denied');
    }

    try {
      const value1 = await AsyncStorage.getItem('lat');
      const value2 = await AsyncStorage.getItem('lng');
      if(value1 !== null){
        changeLongi(value2);
        changeLati(value1);
        changeErrorMsg(null);
   
        _getHomePageDataAsync();   
        //ToastAndroid.showWithGravityAndOffset("stored "+value1+" "+value2,ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
      }else {
        let location = await Location.getLastKnownPositionAsync({enableHighAccuracy: true });
        await props.getLocation(location.coords.latitude,location.coords.longitude);
        // Center the map on the location we just fetched.
        changeLongi(location.coords.longitude);
        changeLati(location.coords.latitude);

  remove("lat")
  remove("lng")
  console.log((location.coords.latitude));
        _storeData("lat",location.coords.latitude+"");
        _storeData("lng",location.coords.longitude+"");
     
       // ToastAndroid.showWithGravityAndOffset("current "+location.coords.latitude+" "+location.coords.longitude,ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
        changeErrorMsg(null);
        _getHomePageDataAsync();
      }
    } catch (e) {
      console.log('Failed to fetch the data from storage');
    }  
  }


  _getHomePageDataAsync = async () => {
  
    //ToastAndroid.showWithGravityAndOffset("API "+latitude+" "+longitude,ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
    
    let dataToSend = {lat: latitude, lng: longitude};
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch('http://justcomfort.umbeo.com/admin/api/homepage', {
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
        _storeData("storeNumber",responseJson.store_number)
        if(responseJson.top_selling.length < 1 && responseJson.recentselling.length < 1 && responseJson.whats_new.length < 1)
        {
          changeResponseStatus(2);
          changeloading(false);
        }
        else 
        {
          console.log(responseJson.status);
          changeResponseStatus(responseJson.status);
          changeTopCategory(responseJson.top_category);
          changeBanner1(responseJson.banner1);
          changeBanner2(responseJson.banner2);
          changeTrendingItems(responseJson.recentselling);
          changeFeaturedItems(responseJson.whats_new);
          changeRecommendedItems(responseJson.top_selling);

          props.getHomescreenData(status= responseJson.status,
              message= responseJson.message,
              banner1= responseJson.banner1,
              banner2= responseJson.banner2,
              top_selling= responseJson.top_selling,
              recent_selling=responseJson.recentselling,
              whats_new= responseJson.whats_new,
              deal_products= responseJson.deal_products,
              top_category= responseJson.top_category);

          props.getStoreId(responseJson.store_id);

          var newProductArray = allProducts;
          
          var top_cat= responseJson.top_selling;
          for(var i=0 ; i<top_cat.length ; i++){
            var flag=0;
            for(var j=0;j<newProductArray.length;j++){
              if(newProductArray[j].description===top_cat[i].description){  
                flag=1;
              }      
            }
            if(flag == 0){
              top_cat[i].category="top_selling";
              newProductArray.push(top_cat[i]);
            } 
          }
          var recent_cat= responseJson.recentselling;
          for(var i=0 ; i<recent_cat.length ; i++){
            var flag=0;
            for(var j=0;j<newProductArray.length;j++){
              if(newProductArray[j].description===recent_cat[i].description){  
                flag=1;
              }
            }
            if(flag == 0){
              recent_cat[i].category="recent_selling";
              newProductArray.push(recent_cat[i]);
            } 
          }
          var featured_cat= responseJson.whats_new;
          for(var i=0 ; i<featured_cat.length ; i++){
            var flag=0;
            for(var j=0;j<newProductArray.length;j++){
              if(newProductArray[j].description===featured_cat[i].description){  
                flag=1;
              }
            }
            if(flag == 0){
              featured_cat[i].category="featured_item";
              newProductArray.push(featured_cat[i]);
            } 
          }
          changeAllProducts(newProductArray);
          props.getAllProducts(newProductArray);

          _addQuantityToArrayItems();

          changeResponseProductData([]);
          var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };

          fetch("http://justcomfort.umbeo.com/admin/api/delivery_info", requestOptions)
            .then(response => response.json())
            .then(result => props.getDeliveryData(result.data))
            .catch(error => console.log('error', error));

          responseJson.top_category.map(async (topCat, i) => {
            await _getProductDataAsync(topCat.cat_id, topCat.title , i)
            if(i === (responseJson.top_category.length-1)){
              changeloading(false);
            }
          });
        }
        
      })
      .catch((error) => {
        changeloading(false);
        console.error("2"+error);
      });
    }
      _getProductDataAsync = async (catID, title,i) => {
        console.log("get product data called")
        new Promise((resolve) => {
          let dataToSend = {cat_id: catID, city: '', lat: latitude, lng: longitude};
          let formBody = [];
          for (let key in dataToSend) {
            let encodedKey = encodeURIComponent(key);
            let encodedValue = encodeURIComponent(dataToSend[key]);
            formBody.push(encodedKey + '=' + encodedValue);
          }
          formBody = formBody.join('&');
    
          fetch('http://justcomfort.umbeo.com/admin/api/cat_product', {
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
            
              let productResponseData = responseJson.data;
              productResponseData[0].parent_category_id = catID;
              productResponseData[0].parent_category_title = title;
              productResponseData.forEach(product => {product.qty = 0;});
              var tempArray = responseProductDataArray;
              console.log(productResponseData)
              tempArray.push(productResponseData)
              changeResponseProductDataArray(tempArray);
              changeResponseStatusProduct(responseJson.status)
              changeResponseProductData(responseJson.data)
              changeResponseProductDataArray(responseProductDataArray)

              props.getItems(responseJson.status,tempArray);

              var newProductArray = allProducts;
              for(var i=0 ; i<productResponseData.length ; i++){
                var flag=0;
                var ind;
                for(var j=0;j<newProductArray.length;j++){
                  if(newProductArray[j].description===productResponseData[i].description){ 
                    flag=1;
                    ind = j;
                  }
                }
                if(flag === 0){
                    newProductArray.push(productResponseData[i]);
                    productResponseData[i].catID_category=title;
                }else{
                  newProductArray[ind].catID_category=title;
                }
              }
              changeAllProducts(newProductArray);
              props.getAllProducts(newProductArray);
            })
            .catch((error) => {
              changeloading(false);
              console.error(error+" ****" +latitude+" "+longitude);
            });
        }) 
      }

      //change
      _addQuantityToArrayItems = () => {
        const newTrendingItems = [...trendingItems]; // clone the array  
        const newFeaturedItems = [...featuredItems]; // clone the array  
        const newRecommendedItems = [...recommendedItems]; // clone the array  
    
        newTrendingItems.map(arrayItem => (
          arrayItem.qty = 0
        ));
        newFeaturedItems.map(arrayItem => (
          arrayItem.qty = 0
        ));
        newRecommendedItems.map(arrayItem => (
          arrayItem.qty = 0
        ));
        changeTrendingItems(newTrendingItems);
        changeFeaturedItems(newFeaturedItems);
        changeRecommendedItems(newRecommendedItems);
        
      }

    const removeItemValue = async (key)=>{
      try {
          await AsyncStorage.removeItem(key);
          return true;
      }
      catch(exception) {
          return false;
      }
  }

  _handleCustomIndexSelect = index => {
    // Tab selection for custom Tab Selection
    changeCustomStyleIndex(index);
  }

  _moveToProductScreen = (navigation) => {
    console.log("cat id >> " + catID);
    let index = -1;
    for(let i = 0; i < responseProductDataArray.length; i++){
      if(responseProductDataArray[i][0].cat_id === catID){
        index = i;
        //return index;
      }else{
        //return index;
      }
    }
    console.log("indexing at" + index);
  }

  _getProductItem = (item,i) => {
    // Function for click on an item
    props.navigation.navigate("AddtoCartPage", {selectedProduct: item, varients: item.varients[0],index: i});
  };

  _renderTopCategoriesWithProducts = (navigation) => {
    if(responseProductDataArray.length && responseProductDataArray.length == topCategories.length)
    {
      // console.log("Render top cate called")
      return(
        responseProductDataArray.map((productDataArray, i) => (
          <View 
            key={productDataArray[0].parent_category_id} 
            style={styles.categorySection}>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={styles.productBasicView}>{productDataArray[0].parent_category_title}</Text>
        
                {/* Navigating TO=Product Screen Here */}
                <TouchableOpacity 
                  onPress={() => {
                    navigation.navigate("ProductScreen", {screen: "ProductsScreen", params: {title: productDataArray[0].parent_category_title}})
                    }}>
                    <Text style={styles.productViewMore}>View More</Text>
                </TouchableOpacity>
            </View>
            <View 
              key={productDataArray[0].parent_category_id}
              >
              <ScrollView horizontal={true} style={styles.trendingHorizontalScrollview}
                showsVerticalScrollIndicator ={false}
                showsHorizontalScrollIndicator={false}>
                {allProducts.map((productData,index) =>
                  {
                    if(productData.catID_category === productDataArray[0].parent_category_title)
                    {
                      return(
                        (
                          <TouchableOpacity key={productData.product_id} onPress={() => _getProductItem(productData,index)}>
                              <View style={styles.trendingCategoryView}>
                                  <View style={{flex: 1}}>
                                      <Image
                                        source={{
                                          uri: productData.product_image,
                                        }}
                                        style={styles.trendingImageStyle}
                                      />
                                      {productData.qty == 0
                                        ?<TouchableOpacity 
                                            style={[styles.trendingParentView]} 
                                            onPress={() => quantityHandler('more', "productDataArray" ,productData.description,index)}>
                                            <FontAwesome name="plus-circle" size={15} color="#FFFFFF"  />
                                        </TouchableOpacity>
                                        :<View style={{width: 40, position: "absolute", right: 0}}>
                                          <TouchableOpacity 
                                            onPress={() => quantityHandler('more', "productDataArray" ,productData.description, index)} 
                                            style={[styles.trendingParentView, {position:"relative"}]}>
                                            <MaterialIcons name="add" size={15} color="#FFFFFF" />
                                          </TouchableOpacity>
                                          <Text style={[styles.trendingParentView2, {position: "relative", fontSize: 13}]}>{productData.qty}</Text>
                                          <TouchableOpacity 
                                            onPress={() => quantityHandler('less',"productDataArray" , productData.description,index)} 
                                            style={[styles.trendingParentView,{position:"relative"}]}>
                                            <MaterialIcons name="remove" size={15} color="#FFFFFF" />
                                          </TouchableOpacity>
                                        </View> 
                                      }

                                  </View>
                                  <View style={{flex: 1}}>
                                    <Text style={{flex: 1, fontSize: 15, margin: 5}}>{productData.product_name}</Text>
                                  </View>
                                  <View style={{flex: 1}}>
                                    <Text style={{flex: 1, fontSize: 12, margin: 5}}>{productData.varients[0].quantity} {productData.unit}</Text>
                                  </View>
                                  <View style={{flex: 1}}>
                                    <Text style={{flex: 1, fontSize: 17, margin: 5,color:"black",fontWeight:"bold"}}>{props.item.currency_sign} {productData.price}</Text>
                                  </View>
                                  {productData.mrp == productData.price ?
          <View/>:<View style={{flex: 1}}>
  <Text style={{flex: 1, textAlign: "right",paddingBottom:5,paddingRight:5}}>
      <Text style={{textDecorationLine:"line-through"}}>  {props.item.currency_sign}{productData.mrp}</Text>
      <Text style={{flex: 1,textAlign: "right", color: 'green', fontSize: 12}}>  {props.item.currency_sign}{productData.mrp - productData.price} Off</Text>
  </Text></View>}
                              </View>
                          </TouchableOpacity>
                        )
                      )
                    }
                  }
                )}
              </ScrollView>
            </View>
          </View>
        ))
      );
    }
    else{
      return null;
    }
  }

  
  const navigation = props.navigation;
  //This will Show a Spinner on Loading the Page
    
  if (loading){
    // console.log("if statement called");
    return (
      <View style={styles.spinnerView}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  //This will render the main page on getting Location Co-ordinates 
  else if(responseStatus == 1){
    // console.log("else if statement called");
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* <MainStackNavigator /> */}
          <View style={{flex: 1}}>
            
            {/* This Part will show the top pick option in Horizontal Manner like " VEGETABLE -- FRUITS -- GROCERY -- PERSONALCAREITEM " */}
            <View>
              <ScrollView 
                horizontal={true} style={[styles.horizontalScrollview]}
                showsVerticalScrollIndicator ={false}
                showsHorizontalScrollIndicator={false}>

                {topCategories.map((topCategory,i) => (

                  <TouchableOpacity key={topCategory.cat_id} 
                    onPress={() => {
                      console.log("top category contains"+JSON.stringify(topCategory))
                      // navigation.navigate("ProductScreen", {screen: "ProductsScreen", params: {title: topCategories[0].parent_category_title}})
                      navigation.navigate("ProductScreen", {screen: "ProductsScreen", params: {title: topCategory.title}})
                    }}>
                        <Text key={topCategory.title} style={styles.textStyles}>{topCategory.title}</Text>
                  </TouchableOpacity>

                  // <TouchableOpacity key={topCategory.cat_id} 
                  //   onPress={() => {
                  //     console.log("top category contains"+JSON.stringify(topCategory))
                  //     // navigation.navigate("ProductScreen", {screen: "ProductsScreen", params: {title: topCategories[0].parent_category_title}})
                  //     navigation.navigate("ProductScreen", {screen: "ProductsScreen", params: {title: topCategory.title}})
                  //   }}
                  // >
                  //     <View style={{flexDirection:"column",overflow:"hidden",width:80,justifyContent:"center",backgroundColor:"white",height:"95%",marginLeft:3,marginRight:3,marginTop:2,borderRadius:10}}>
                  //       <Image style={{flex:2,width:50,height:50,borderRadius:50,alignSelf:"center",marginTop:5}} source={{uri: topCategory.image}}/> 
                  //       <Text key={topCategory.title} style={{flex:1,textAlign:"center",fontSize:8,marginTop:5,fontWeight:"bold",color:"#062FFF"}}>{topCategory.title}</Text>
                  //     </View>
                  // </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
  
            {/* Search Bar */}
            <View style={styles.SectionStyle}>
                <EvilIcons style={styles.keyIcon} name="search" size={24} color="black" />
                <TextInput
                    style={styles.inputStyle}
                    placeholder="Search"
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#6C6969"
                    keyboardType="default"
                    onFocus={() => navigation.navigate("Search")}
                    blurOnSubmit={false}
                />
            </View>
            
            {/* Banner Images */}
            <View>
              <ScrollView horizontal={true}
              showsVerticalScrollIndicator ={false}
              showsHorizontalScrollIndicator={false}
              > 
                {banner1.map(bannerPhoto => (
                  <Image key={bannerPhoto.banner_id} source={{
                    //banner: bannerPhoto.banner_image,
                    uri:bannerPhoto.banner_image,
                    }}
                    style={styles.imageStyle}
                  />
                ))}
              </ScrollView>
            </View>
            
            {/* 4th Component with 3 menu options i.e " TRENDING -- FEATURED -- RECOMMENDED " */}
            <SegmentedControlTab
              values={['TRENDING', 'FEATURED', 'RECOMMENDED']}
              selectedIndex={customStyleIndex}
              onTabPress={_handleCustomIndexSelect}
              borderRadius={0}
              tabsContainerStyle={{
                height: 50,
              }}
              tabStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                backgroundColor: '#F2EDED',
              }}
              activeTabStyle={{backgroundColor: '#F2EDED', borderBottomWidth: 1, borderColor: '#062FFF',}}
              tabTextStyle={{color: '#000000', fontSize: 12,}}
              activeTabTextStyle={{color: '#062FFF', fontWeight: 'bold'}}
            />
            {/* change */}
            
            {customStyleIndex === 0 && (
              <View>
                  <ScrollView horizontal={true} style={styles.trendingHorizontalScrollview}
                      showsVerticalScrollIndicator ={false}
                      showsHorizontalScrollIndicator={false}
                      >
                          {
                            allProducts.map((trendingItem, i) => {
                              if(trendingItem.category == "top_selling")
                              {
                                if(trendingItem.offers!=null && trendingItem.offers.length>0)
                               { let offers = trendingItem.offers;
                                offers = offers.replace("'\'","");
                                trendingOffer = JSON.parse(offers, (key, value) => {
                                  if (typeof value === 'string') {
                                    return value.toUpperCase();
                                  }
                                  return value;
                                });
                              }
                                return(
                                  <TouchableOpacity key={trendingItem.varient_id} onPress={() => _getProductItem(trendingItem,i)}>
                                      <View style={styles.trendingView}>
                                          <View style={{flex: 1}}>
                                            <Image
                                              source={{
                                                uri:trendingItem.product_image,
                                              }}
                                              style={[styles.trendingImageStyle]}
                                            />
                                            
                                            {trendingItem.qty == 0
                                            ?<TouchableOpacity 
                                                style={styles.trendingParentView} 
                                                onPress={() => quantityHandler('more', "trendingItem" ,trendingItem.description,i)}>
                                                <FontAwesome name="plus-circle" size={15} color="#FFFFFF"  />
                                              </TouchableOpacity>
                                            :<View style={{width: 40, position: "absolute", right: 0}}>
                                              <TouchableOpacity 
                                                onPress={() => quantityHandler('more', "trendingItem" ,trendingItem.description,i)} 
                                                style={[styles.trendingParentView, {position: "relative"}]}>
                                                <MaterialIcons name="add" size={15} color="#FFFFFF" />
                                              </TouchableOpacity>
                                              <Text style={[styles.trendingParentView2, {position: "relative", fontSize: 13}]}>{trendingItem.qty}</Text>
                                              <TouchableOpacity 
                                                onPress={() => quantityHandler('less',"trendingItem" , trendingItem.description,i)} 
                                                style={[styles.trendingParentView, {position: "relative"}]}>
                                                <MaterialIcons name="remove" size={15} color="#FFFFFF" />
                                              </TouchableOpacity>
                                            </View> }
                                            
                                          </View> 
                                          <View style={{flex: 1}}>
                                            <Text style={{flex: 1, fontSize: 15, margin: 5}}>
                                                {trendingItem.product_name}
                                            </Text>
                                          </View>
                                          <View style={{flex: 1}}>
                                            <Text style={{flex: 1, fontSize: 12, margin: 5}}>
                                              {trendingItem.varients[0].quantity} {trendingItem.unit}
                                            </Text>
                                          </View>
                                          {
  trendingItem.offers!=null && trendingItem.offers.length>0? 
  <View style ={{backgroundColor : "#7FFFD4",margin : 8,padding : 8}}  > 
  <ViewMoreText
  numberOfLines={1}
>
<Text>Offers !!{'\n'}</Text>
    {trendingOffer.map(i => {return (<Text>{'\n'}Buy {i.minq} to {i.maxq} at Rs {i.price}</Text>)})}
    </ViewMoreText>
    </View>
                                             
                                              :<View>
                                              </View>

}
                                       
                                     
                                          <View style={{flex: 1}}>
                                            <Text style={{flex: 1, fontSize: 17, margin: 5,color:"black",fontWeight:"bold"}}>
                                                {props.item.currency_sign} {trendingItem.price}
                                            </Text>
                                          </View>
                                        
                                          {trendingItem.mrp == trendingItem.price ?
          <View/>:<View style={{flex: 1}}>
  <Text style={{flex: 1, textAlign: "right",paddingBottom:5,paddingRight:5}}>
      <Text style={{textDecorationLine:"line-through"}}>  {props.item.currency_sign}{trendingItem.mrp}</Text>
      <Text style={{flex: 1,textAlign: "right", color: 'green', fontSize: 12}}>  {props.item.currency_sign}{trendingItem.mrp - trendingItem.price} Off</Text>
  </Text></View>
}


                                        </View>

                                     
                                  </TouchableOpacity>
                                  )
                              }
                            }) }
                        
                  </ScrollView>
              </View>
            )}
            {customStyleIndex === 1 && (
                <View>
                    <ScrollView horizontal={true} style={styles.trendingHorizontalScrollview}
                        showsVerticalScrollIndicator ={false}
                        showsHorizontalScrollIndicator={false}
                        >
                          {allProducts.map((featuredItem, i) =>{
                            if(featuredItem.category === "featured_item")
                            {
                              if(featuredItem.offers!=null && featuredItem.offers.length>0)
                               { let offers = featuredItem.offers;
                                offers = offers.replace("'\'","");
                                trendingOffer = JSON.parse(offers, (key, value) => {
                                  if (typeof value === 'string') {
                                    return value.toUpperCase();
                                  }
                                  return value;
                                });
                              }
                                
                              return(
                                /** onPress={() => _getProductItem(featuredItem)} */
                                <TouchableOpacity key={featuredItem.varient_id} onPress={() => _getProductItem(featuredItem,i)}>
                                    <View style={styles.trendingView}>
                                      <View style={{flex: 1}}>
                                        <Image
                                          source={{
                                           uri:featuredItem.product_image,
                                          }}
                                          style={styles.trendingImageStyle}
                                        />
    
                                          {featuredItem.qty == 0
                                            ?<TouchableOpacity style={styles.trendingParentView} onPress={() => quantityHandler('more', "featuredItems" ,featuredItem.description,i)}>
                                                <FontAwesome name="plus-circle" size={15} color="#FFFFFF"  />
                                              </TouchableOpacity>
                                            :<View style={{width: 40, position: "absolute", right: 0}}>
                                              <TouchableOpacity onPress={() => quantityHandler('more', "featuredItems" ,featuredItem.description,i)} style={[styles.trendingParentView, {position: "relative"}]}>
                                                <MaterialIcons name="add" size={15} color="#FFFFFF" />
                                              </TouchableOpacity>
                                              <Text style={[styles.trendingParentView2, {position: "relative", fontSize: 13}]}>{featuredItem.qty}</Text>
                                              <TouchableOpacity onPress={() => quantityHandler('less', "featuredItems" ,featuredItem.description,i)} style={[styles.trendingParentView, {position: "relative"}]}>
                                                <MaterialIcons name="remove" size={15} color="#FFFFFF" />
                                              </TouchableOpacity>
                                            </View> 
                                          }
                                        
                                      </View> 
                                      <View style={{flex: 1}}>
                                        <Text style={{flex: 1, fontSize: 15, margin: 5}}>
                                            {featuredItem.product_name}
                                        </Text>
                                      </View>
                                      <View style={{flex: 1}}>
                                        <Text style={{flex: 1, fontSize: 12, margin: 5}}>
                                        {featuredItem.varients[0].quantity} {featuredItem.unit}
                                        </Text>
                                      </View>
                                      {
  featuredItem.offers!=null && featuredItem.offers.length>0? 
  <View   style ={{backgroundColor : "#7FFFD4",margin : 8,padding : 8}}  > 
  <ViewMoreText
  numberOfLines={1}
>
<Text>Offers !!{'\n'}</Text>
    {trendingOffer.map(i => {return (<Text>{'\n'}Buy {i.minq} to {i.maxq} at Rs {i.price}</Text>)})}
    </ViewMoreText>
    </View>
                                             
                                              :<View></View>

}
   
                                      <View style={{flex: 1}}>
                                        <Text style={{flex: 1, fontSize: 17, margin: 5,color:"black",fontWeight:"bold"}}>
                                            {props.item.currency_sign} {featuredItem.price}
                                        </Text>
                                      </View>
                                      {featuredItem.mrp == featuredItem.price ?
          <View/>:<View style={{flex: 1}}>
  <Text style={{flex: 1, textAlign: "right",paddingBottom:5,paddingRight:5}}>
      <Text style={{textDecorationLine:"line-through"}}>  {props.item.currency_sign}{featuredItem.mrp}</Text>
      <Text style={{flex: 1,textAlign: "right", color: 'green', fontSize: 12}}>  {props.item.currency_sign}{featuredItem.mrp - featuredItem.price} Off</Text>
  </Text></View>}
                                    </View>
                                </TouchableOpacity>
                            )
                            }
                          } )}
                    </ScrollView>
                </View>
            )}
            {customStyleIndex === 2 && (
                <View>
                  <ScrollView horizontal={true} style={styles.trendingHorizontalScrollview}
                      showsVerticalScrollIndicator ={false}
                      showsHorizontalScrollIndicator={false}
                      >
                        {allProducts.map((recommendedItem, i) => {
                          if(recommendedItem.category === "recent_selling")
                          {
                            if(recommendedItem.offers!=null && recommendedItem.offers.length>0)
                               { let offers = recommendedItem.offers;
                                offers = offers.replace("'\'","");
                                trendingOffer = JSON.parse(offers, (key, value) => {
                                  if (typeof value === 'string') {
                                    return value.toUpperCase();
                                  }
                                  return value;
                                });
                              }
                                
                            return( 
                              <TouchableOpacity key={recommendedItem.varient_id} onPress={() => _getProductItem(recommendedItem,i)}>
                                  <View style={styles.trendingView}>
                                    <View style={{flex: 1}}>
                                      <Image
                                        source={{
                                         uri:recommendedItem.product_image,
                                        }}
                                        style={styles.trendingImageStyle}
                                      />
                                      {recommendedItem.qty == 0
                                        ?<TouchableOpacity style={styles.trendingParentView} onPress={() => quantityHandler('more', "recommendedItems" ,recommendedItem.description,i)}>
                                            <FontAwesome name="plus-circle" size={15} color="#FFFFFF"  />
                                          </TouchableOpacity>
                                        :<View style={{width: 40, position: "absolute", right: 0}}>
                                          <TouchableOpacity onPress={() => quantityHandler('more', "recommendedItems" ,recommendedItem.description,i)} style={[styles.trendingParentView, {position: "relative"}]}>
                                            <MaterialIcons name="add" size={15} color="#FFFFFF" />
                                          </TouchableOpacity>
                                          <Text style={[styles.trendingParentView2, { position: "relative", fontSize: 13}]}>{recommendedItem.qty}</Text>
                                          <TouchableOpacity onPress={() => quantityHandler('less', "recommendedItems" ,recommendedItem.description,i)} style={[styles.trendingParentView, {position: "relative"}]}>
                                            <MaterialIcons name="remove" size={15} color="#FFFFFF" />
                                          </TouchableOpacity>
                                        </View> 
                                      }
                                    </View> 
                                    <View style={{flex: 1}}>
                                      <Text style={{flex: 1, fontSize: 15, margin: 5}}>
                                          {recommendedItem.product_name}
                                      </Text>
                                    </View>
                                    <View style={{flex: 1}}>
                                      <Text style={{flex: 1, fontSize: 12, margin: 5}}>
                                      {recommendedItem.varients[0].quantity}  {recommendedItem.unit}
                                      </Text>
                                    </View>
                                    {
  recommendedItem.offers!=null && recommendedItem.offers.length>0? 
  <View   style ={{backgroundColor : "#7FFFD4",margin : 8,padding : 8}}  > 
  <ViewMoreText
  numberOfLines={1}
>
<Text>Offers !!{'\n'}</Text>
    {trendingOffer.map(i => {return (<Text>{'\n'}Buy {i.minq} to {i.maxq} at Rs {i.price}</Text>)})}
    </ViewMoreText>
    </View>
                                             
                                              :<View></View>

}
                                    <View style={{flex: 1}}>
                                      <Text style={{flex: 1, fontSize: 17, margin: 5,color:"black",fontWeight:"bold"}}>
                                          {props.item.currency_sign}  {recommendedItem.price}
                                      </Text>
                                    </View>
                                    {recommendedItem.mrp == recommendedItem.price ?
          <View/>:<View style={{flex: 1}}>
  <Text style={{flex: 1, textAlign: "right",paddingBottom:5,paddingRight:5}}>
      <Text style={{textDecorationLine:"line-through"}}>  {props.item.currency_sign}{recommendedItem.mrp}</Text>
      <Text style={{flex: 1,textAlign: "right", color: 'green', fontSize: 12}}>  {props.item.currency_sign}{recommendedItem.mrp - recommendedItem.price} Off</Text>
  </Text></View>}
                                  </View>
                              </TouchableOpacity>
                            )
                          }
                        })}
                  </ScrollView>
                </View>
            )}
            
            {/* Last Banner Images Cart */}
            <View>
              <ScrollView 
                style={{flexDirection:"row"}}
                horizontal={true}
                showsVerticalScrollIndicator ={false}
                showsHorizontalScrollIndicator={false}>
                   
                {banner2.map(bannerPhoto2 => (
                  <Image key={bannerPhoto2.sec_banner_id} source={{
                    //banner: bannerPhoto.banner_image,
                    uri:bannerPhoto2.banner_image,
                    }}
                    style={[styles.imageStyle]}
                  />
                ))}
              </ScrollView>
            </View>
            
            {/* This will display a menu of Top Categories products with Headers */}
            {_renderTopCategoriesWithProducts(props.navigation)}

            
          </View>
          
        
        {/* <BottomNavigationMenu /> */}
        </ScrollView>
        <View style={{position:"absolute",bottom:30,right:30}}>
          {plusButtons?<View >
            {/* Phone */}
            <TouchableOpacity 
              onPress={() =>{
                let number = '';
                if (Platform.OS === 'ios') {
                number = 'telprompt:+91'+storeNumber;
                }
                else {  
                number = 'tel:+91'+storeNumber; 
                }
                Linking.openURL(number);
              }}
              style={{backgroundColor:"#062FFF",marginBottom:5,borderRadius:100,padding:10,justifyContent:"center",alignItems:"center"}}>
            <FontAwesome name="phone" size={20} color="#FFFFFF"  />
            </TouchableOpacity>
                    
            {/* Whatsapp */}
            <TouchableOpacity 
              onPress={() => {
                let url= "whatsapp://send&phone=91"+storeNumber
                Linking.openURL(url)
                .then(data => {
                  console.log("WhatsApp Opened successfully " + data);  //<---Success
                })
                .catch(() => {
                  alert("Make sure WhatsApp installed on your device");  //<---Error
                }); 
              }}
              style={{backgroundColor:"#062FFF",marginBottom:5,borderRadius:50,padding:10,justifyContent:"center",alignItems:"center"}}>
            <FontAwesome name="whatsapp" size={20} color="#FFFFFF"  />
            </TouchableOpacity>

            {/* users */}
            <TouchableOpacity style={{backgroundColor:"#062FFF",marginBottom:5,borderRadius:50,padding:10,justifyContent:"center",alignItems:"center"}}>
            <FontAwesome name="users" size={20} color="#FFFFFF"  />
            </TouchableOpacity>

            {/* Share */}
            <TouchableOpacity
              onPress={() => {
                Share.share({
                message: 'just comfortApp',
                url: 'http://',
                title: 'Wow, did you see that?'
              }, {
                // Android only:
                dialogTitle: 'Share BAM goodness',
                // iOS only:
                excludedActivityTypes: [
                  'com.apple.UIKit.activity.PostToTwitter'
                ]
              })}}
              style={{backgroundColor:"#062FFF",width:50,marginBottom:5,borderRadius:50,padding:10,justifyContent:"center",alignItems:"center"}}>
            <FontAwesome name="share-alt" size={20} color="#FFFFFF"  />
            </TouchableOpacity>
          </View>:<View></View>}

          <View>
            {/* Main Icon */}
            {plusButtons?<TouchableOpacity 
              onPress={() => {
                changePlusButton(!plusButtons)
              }}
              style={{marginBottom:5,borderRadius:100,justifyContent:"center",alignItems:"center"}}>
              <FontAwesome name="times-circle" size={60} color="#062FFF"  />
            </TouchableOpacity>:<TouchableOpacity 
              onPress={() => {
                changePlusButton(!plusButtons)
              }}
              style={{marginBottom:5,borderRadius:100,justifyContent:"center",alignItems:"center"}}>
              <FontAwesome name="plus-circle" size={60} color="#062FFF"  />
            </TouchableOpacity>}
          </View>
        </View>
      </SafeAreaView>
    );
  }
  //This Will Be the Result if we don't get location Co-ordinate
  else if(responseStatus == 2)
  {
    return(
      <SafeAreaView style={styles.noItemsContainer}>
      <View style={styles.items}>
          <Text style={styles.itemstext}>
            We are not delivering in this Area.
          </Text>
        </View>
        
        <View style={styles.rechargebutton}> 
          <TouchableOpacity onPress={() => {
            console.log(latitude+" "+longitude)
            try {
              navigation.navigate('MapComponent', {screen: "MapComponent", params: {latitude:latitude,longitude:longitude}})
            } catch (error) {
              console.log("3"+error)
            }
          }}
>
            <Text style={styles.textRecharge}>CHANGE YOUR LOCATION</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
    );
  }
  else{
    return (
    <View><Text style={{textAlign:"center",width:"90%",marginLeft:"auto",marginRight:"auto",marginTop:300,color:"grey"}}>We are unable to connect to our service, Please check your Internet Connection or try again later!!</Text>{/* {_getHomePageDataAsync()} */}</View>

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
export default connect(mapStateToProps, {getItems,getLocation,updatedCart,getHomescreenData,getAllProducts,getCurrency,getDeliveryData, getUserData, getNotifyByData,getStoreId})(Homescreen);
// export default HomeScreen;

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height * 0.90,
},
heading: {
  alignSelf: 'center',
  paddingTop: 20,
  marginBottom: 10,
  fontSize: 24
},
  container:{
    flex:1,
    backgroundColor:'#F2EDED',
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
    elevation:5,
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 7, 
    marginRight: 8,
    width:172
  },
  trendingParentView: {
    position: 'absolute',
    right: -4,
    top: -4,
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
  trendingParentView2: {
    position: 'absolute',
    right: -4,
    top: 0,
    bottom: 0,
    width: 30,
    height: 30,
    margin: 5,
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
    width: 130,
    height: 100,
    marginTop:15
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
    elevation:5,
  },
  trendingCategoryView:{
    elevation:5,
    flex: 1, 
    backgroundColor: '#F2EDED', 
    borderRadius: 7, 
    marginRight: 8,
    // marginTop: 3,
    // padding: 7,
    // paddingLeft:0,
    width:172
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