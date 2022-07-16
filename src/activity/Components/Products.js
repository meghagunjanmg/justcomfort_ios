import React, {useState, useEffect} from "react";
import { View, Image, ScrollView, StyleSheet, Text, TouchableOpacity, BackHandler , TextInput} from "react-native";
import ViewMoreText from 'react-native-view-more-text';

import {EvilIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import {Provider} from "react-redux";
import {connect} from "react-redux";
import {updatedCart,getAllProducts} from "../../actions/itemsAction.js";

const Products = (props) => {
  // console.log(`products page called with data:- ${props.route.params.data}`)
  var [loading,changeloading] = useState(true);
  var [responseStatusProduct,changeresponseStatusProduct] = useState('');
  var [allProducts,changeAllProducts] = useState(props.item.allProductsData);
  var [cartItemsArray,changeCartItemsArray] = useState(props.item.cartItems);
  var title= props.route.params.title;
  var [Offer,changeOffer] = useState([]);

  useEffect(() => {
    // code to run on component mount
    // _getProductDataAsync();
  }, []);

  // _getProductDataAsync = async () => {
  //   responseProductData
  // }
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
      // console.log(`Item ${cartItemsArray[indexInCart].description} already present with qty = ${cartItemsArray[indexInCart].qty}`)
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
     
		}
  }
  

  _getProductItem = (item,i) => {
    // Function for click on an item
    props.navigation.navigate("AddtoCartPage", {selectedProduct: item, varients: item.varients[0],index: i});
  };

  return(
    <View style={styles.categorySection}>
      <ScrollView 
        showsVerticalScrollIndicator ={false}
        showsHorizontalScrollIndicator={false}>
            <Text style={{backgroundColor:"white",elevation:10,textAlign:"center",paddingTop:20,marginBottom:20,borderBottomColor:"#062FFF",width:"100%",marginLeft:"auto",marginRight:"auto",borderBottomWidth:2,paddingBottom:10,color:"#062FFF",fontSize:20}}>
              {title}
            </Text>
            {/* Search Bar */}
            <View style={styles.SectionStyle}>
                <EvilIcons style={styles.keyIcon} name="search" size={24} color="black" />
                <TextInput
                    style={styles.inputStyle}
                    placeholder="Search"
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#6C6969"
                    keyboardType="default"
                    onFocus={() => props.navigation.navigate("Search")}
                    blurOnSubmit={false}
                />
            </View>
            <View style={styles.container}>
              {allProducts.map((productData, i) => {
                if(productData.catID_category === title)
                {
                  if(productData.offers!=null && productData.offers.length>0)
                  { let offers = productData.offers;
                   offers = offers.replace("'\'","");
                   Offer = JSON.parse(offers, (key, value) => {
                     if (typeof value === 'string') {
                       return value.toUpperCase();
                     }
                     return value;
                   });
                 }
                  return(
                    <TouchableOpacity key={productData.product_id} style={styles.productSection} onPress={() => _getProductItem(productData,i)}>
                        <View>
                          <Image
                            source={{
                            uri:+ productData.product_image,
                            }}
                            style={styles.trendingImageStyle}
                          />  
                          {productData.qty == 0
                          ?<TouchableOpacity 
                              style={[styles.trendingParentView,{groundColor: '#062FFF'}]} 
                              onPress={() => quantityHandler('more', "" , productData.description,i)}>
                              <FontAwesome name="plus-circle" size={15} color="#FFFFFF"  />
                            </TouchableOpacity>
                          :<View style={{width: 40, position: "absolute", right: 0}}>
                            <TouchableOpacity 
                              onPress={() => quantityHandler('more', "" , productData.description,i)} 
                              style={[styles.trendingParentView, {position: "relative",backgroundColor: '#062FFF'}]}>
                              <MaterialIcons name="add" size={15} color="#FFFFFF" />
                            </TouchableOpacity>
                            <Text style={[styles.trendingParentView2, { position: "relative", fontSize: 13}]}>{productData.qty}</Text>
                            <TouchableOpacity 
                              onPress={() => quantityHandler('less', "" , productData.description,i)} 
                              style={[styles.trendingParentView, {position: "relative",backgroundColor: '#062FFF'}]}>
                              <MaterialIcons name="remove" size={15} color="#FFFFFF" />
                            </TouchableOpacity>
                          </View> }
                          
                          <Text style={{fontSize: 15, margin: 5, height: 50}}>{productData.product_name} </Text>
                          <Text style={{ fontSize: 12, margin: 5, height: 20}}>{productData.varients[0].quantity} {productData.unit}</Text>
                          <Text style={{fontSize: 17, margin: 5,color:"black",fontWeight:"bold"}}>{props.item.currency_sign} {productData.price}</Text>
                     
                          {productData.mrp == productData.price ?
          <View/>:<View style={{flex: 1}}>
  <Text style={{flex: 1, textAlign: "right",paddingBottom:5,paddingRight:5}}>
      <Text style={{textDecorationLine:"line-through"}}>  {props.item.currency_sign}{productData.mrp}</Text>
      <Text style={{flex: 1,textAlign: "right", color: 'green', fontSize: 12}}>  {props.item.currency_sign}{productData.mrp - productData.price} Off</Text>
  </Text></View>}
  {
  productData.offers!=null && productData.offers.length>0? 
  <View style ={{backgroundColor : "#7FFFD4",margin : 8,padding : 8}}  > 
  <ViewMoreText
  numberOfLines={1}
>
<Text>Offers !!{'\n'}</Text>
    {Offer.map(i => {return (<Text>{'\n'}Buy {i.minq} to {i.maxq} at Rs {i.price}</Text>)})}
    </ViewMoreText>
    </View>
                                             
                                              :<View>
                                              </View>

}
                        </View>
                    </TouchableOpacity>
                  )
                }
              })}
            </View>
      </ScrollView>
    </View>
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
export default connect(mapStateToProps, {updatedCart,getAllProducts})(Products);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  trendingParentView: {
    position: 'absolute',
    right: -8,
    top: -8,
    bottom: 0,
    width: 30,
    height: 30,
    margin: 5,
    // backgroundColor: '#062FFF',
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderRadius: 7,
  },
  trendingParentView2: {
    position: 'absolute',
    right: -8,
    top: -5,
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
    width: 155,
    height: 120,
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
  keyIcon:{
    padding: 5,
    margin: 5,
  },
  inputStyle: {
    flex: 1,
    color: '#000000',
    paddingLeft: 5,
    paddingRight: 5,
    height: 40,
  },
  // categorySection:{
  //   backgroundColor: '#FFFFFF',
  // },
  productSection:{
    backgroundColor: 'white', 
    elevation:5,
    borderRadius: 7,
    padding: 4,
    margin: 4,
    marginRight: 5,
    width: '47%',
  }
});