import React, {useState, useEffect} from "react";
import { View, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";

import { EvilIcons, MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-simple-toast';
import {connect} from "react-redux";
import {updatedCart,getAllProducts} from "../../actions/itemsAction.js";

const AddtoCartPage = (props) => {
    var [selectedProductData,changeselectedProductData] = useState(props.route.params.selectedProduct);
    var [selectedProductVarients,changerselectedProductVarients] = useState(props.route.params.varients);
    var [cartItemsArray,changeCartItemsArray] = useState(props.item.cartItems);
    var [allProducts,changeAllProducts] = useState(props.item.allProductsData);
    var [Offer,changeOffer] = useState([]);
    var [OfferPrice,changeOfferPrice] = useState();
    const productPriceValue = Number(0);


    // console.log(selectedProductData.product_image)
    useEffect(() => {
        // code to run on component mount
        // props.route.params.selectedProduct.qty = 0;
        // props.route.params.varients.qty = 0;
        // props.route.params.varients.product_name = props.route.params.selectedProduct.product_name;
        // changeselectedProductData(props.route.params.selectedProduct);
        // changerselectedProductVarients(props.route.params.varients);


    }, []);
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
            // console.log(`Index is:- ${indexInCart}`);
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
    // quantityHandler = (action) => {
    //     console.log(selectedProductVarients);
	// 	let currentQty = selectedProductVarients.qty;
		
	// 	if(action == 'more'){
    //         selectedProductData.qty = currentQty + 1;
	// 		selectedProductVarients.qty = currentQty + 1;
	// 	} else if(action == 'less'){
    //         selectedProductData.qty = currentQty - 1;
	// 		selectedProductVarients.qty = currentQty - 1;
	// 	}
    //     console.log(selectedProductVarients);

    //     var indexInCart = null;
    //     for(var i=0;i<cartItemsArray.length;i++)
    //         if(cartItemsArray[i].description === selectedProductVarients.description)
    //             indexInCart = [i];

    //     console.log(`Index is:- ${indexInCart}`);

    //     if (indexInCart === null){
    //         var tempArray=cartItemsArray;
    //         var dataToBePushed = {};

    //         dataToBePushed = selectedProductData;
    //         dataToBePushed.qty = selectedProductData.qty;
    //         dataToBePushed.varients = selectedProductVarients;
    //         dataToBePushed.varients.qty = selectedProductVarients.qty;
    //         console.log(dataToBePushed);
    //         console.log(`response product data array :- ${selectedProductVarients}`)
    //         tempArray.push(dataToBePushed);
    //         changeCartItemsArray(tempArray);
    //         props.updatedCart(cartItemsArray,"productDataArray",selectedProductVarients.description);
    //         console.log(`now the cart item are:- ${cartItemsArray} with qty :- ${cartItemsArray[0].qty}`)
    //         //Updating the PartOf qty of that item
    //         console.log(`Item is :- ${selectedProductVarients.description} with Qty :- ${selectedProductVarients.qty} and TotalQuantity :- ${selectedProductVarients.quantity}`);
    //     }else{
    //         console.log(`Item ${cartItemsArray[indexInCart].description} already present with qty = ${cartItemsArray[indexInCart].qty}`)
    //         var updateQty = cartItemsArray[indexInCart].qty;
    //         updateQty= selectedProductVarients.qty;
    //         var tempArray = cartItemsArray;
    //         tempArray[indexInCart].qty = updateQty; 
    //         changeCartItemsArray(tempArray);
    //         props.updatedCart(cartItemsArray,"productDataArray",selectedProductVarients.description);
    //         console.log(cartItemsArray[indexInCart])
    //         console.log(`New Qty is = ${cartItemsArray[indexInCart].qty}`)
    //     }

	// 	changerselectedProductVarients(selectedProductVarients); // set new state
	// }

    const addToCartItems = () => {
        //Update the cart items here
        if(selectedProductVarients.qty == 0)
            Toast.show("Add quantity to add to cart!");
        else
            Toast.show("Product added to cart!");
        
    }
 
    const subTotalPrice = () => {
       
        if(selectedProductData.qty === 0 || selectedProductData.qty === undefined || selectedProductData.qty === null)
         return 0;
         
        else{
            if(selectedProductData.offers!=null && selectedProductData.offers.length>0)
            { let offers = selectedProductData.offers;
             offers = offers.replace("'\'","");
             Offer = JSON.parse(offers, (key, value) => {
               if (typeof value === 'string') {
                 return value.toUpperCase();
               }
               return value;
             });
            }
            
            return(cartItemsArray.map(item => {

                if(item.product_id === selectedProductData.product_id)
                {    
               try {

                if(selectedProductData.offers.length === 0  || selectedProductData.offers === null){
                    return item.qty * selectedProductData.price;
                }

               else {Offer.map(i => 
                    {
                        if(i.minq<=item.qty && i.maxq>item.qty){                           
                            OfferPrice = i.price;
                        }
                        else OfferPrice = item.price
                    }
                    )}                    
                    return item.qty * OfferPrice;
               } catch (error) {                  
                    //return item.qty * selectedProductData.price;
               } 
            }
            }))
         }
    }

    return(
        <SafeAreaView
         style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={{height:200}}>
                    <Image
                      source={{
                       uri:selectedProductData.product_image,
                      }}
                      style={styles.trendingImageStyle}
                    />
                </View>
                <View 
                    // style={{width:"95%",marginLeft:"auto",marginRight:"auto",backgroundColor:"white",borderRadius:10,elevation:10}}
                    >
                    <View>
                        <Text style={{fontSize: 20, margin: 5, height: 25, fontWeight:"bold"}}>{selectedProductData.product_name} </Text>
                        <Text style={{fontSize: 14, margin: 5, height: 25, color: "#C8C8C8" }}>{selectedProductVarients.description} </Text>
                    </View>
                    <Text style={{fontSize:15,marginTop:2,marginBottom:2}}> {selectedProductData.varients[0].quantity} {selectedProductVarients.unit}</Text>
                    <View style={{flexDirection: 'row'}}>
                       

                        {selectedProductVarients.mrp == selectedProductVarients.price ?
          <View/>:<View style={{flex: 1}}>
  <Text style={{paddingBottom:5,paddingRight:5}}>
      <Text style={{textDecorationLine:"line-through"}}>  {props.item.currency_sign}{selectedProductVarients.mrp}</Text>
      <Text style={{flex: 1, color: 'green', fontSize: 12}}>  {props.item.currency_sign}{selectedProductVarients.mrp - selectedProductVarients.price} Off</Text>
  </Text></View>}
                        
                        <View style={{flexDirection: 'row', position: "absolute", right: 0, borderColor: '#062FFF', borderRadius: 7, borderWidth: 1,}}>
                            {
                                selectedProductData.qty === 0 || selectedProductData.qty === undefined || selectedProductData.qty === null ?
                                <TouchableOpacity 
                                    // onPress={() => quantityHandler('less',"",selectedProductData.description,props.route.params.index)} 
                                    style={[styles.trendingParentView, {position: "relative"}]}>
                                    <MaterialIcons name="remove" size={15} color="#FFFFFF" />
                                </TouchableOpacity>:
                                cartItemsArray.map(item => {
                                    if(item.description === selectedProductData.description)
                                    {
                                        return(
                                        <TouchableOpacity key={selectedProductData.product_id} onPress={() => quantityHandler('less',"",selectedProductData.description,props.route.params.index)} style={[styles.trendingParentView, {position: "relative"}]}>
                                            <MaterialIcons name="remove" size={15} color="#FFFFFF" />
                                        </TouchableOpacity>)
                                    }
                                })

                            }
                            {
                                selectedProductData.qty === 0 || selectedProductData.qty === undefined || selectedProductData.qty === null ?
                                <Text style={[styles.trendingParentView, {backgroundColor: '#FFFFFF', position: "relative", fontSize: 13, top: 5}]}>
                                0
                                </Text>:
                                cartItemsArray.map(item => {
                                    if(item.description === selectedProductData.description)
                                    {
                                        return(
                                        <Text key={selectedProductData.product_name} style={[styles.trendingParentView, {backgroundColor: '#FFFFFF', position: "relative", fontSize: 13, top: 5}]}>
                                            {item.qty}
                                        </Text>)
                                    }
                                })

                            }
                            <TouchableOpacity onPress={() => quantityHandler('more',"",selectedProductData.description,props.route.params.index)} style={[styles.trendingParentView, {position: "relative"}]}>
                                <MaterialIcons name="add" size={15} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', padding: 20, alignItems: 'center'}}>
                        
                    </View>

                    <View style={{flexDirection: 'row',paddingTop:10, paddingBottom: 20, alignItems: 'center', borderTopColor:"#C8C8C8",borderTopWidth:1,borderBottomColor:"#C8C8C8",borderBottomWidth:1,width:"95%",marginLeft:"auto",marginRight:"auto"}}>
                        <Text style={{fontWeight: 'bold',flex:10, color: "#062FFF"}}>SubTotal: </Text>
                        <Text style={{margin: 5,flex:2,fontWeight: 'bold', color: "#062FFF",textAlign:"right"}}>{props.item.currency_sign} {subTotalPrice()}</Text>
                    </View>
                </View>

                <View style={{marginTop:5}}>
                    {/* <TouchableOpacity style={[styles.cartButton, {}]} onPress={() => addToCartItems()}>
                        <Text style={{fontWeight: 'bold', color: "#FFFFFF"}}>Add to Cart </Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={[styles.cartButton, {}]} onPress={() => props.navigation.navigate("CartScreen")}>
                        <Text style={{fontWeight: 'bold', color: "#FFFFFF"}}>Go to Cart </Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        </SafeAreaView>
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
export default connect(mapStateToProps, {updatedCart,getAllProducts})(AddtoCartPage);

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      margin: 5,
      padding: 5,
      borderRadius: 10,
      height: '100%',
    },
    productSection:{
        backgroundColor: '#F2EDED', 
        borderRadius: 7,
        padding: 4,
        margin: 4,
        marginRight: 5,
    },
    trendingImageStyle:{
        //padding: 50,
        // margin: 5,
        // borderRadius: 15,
        // alignItems: 'center',
        width: 160,
        height: 150
    },
    trendingParentView: {
        width: 30,
        height: 30,
        margin: 5,
        position: "absolute",
        backgroundColor: '#062FFF',
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        borderRadius: 7,
    },
    cartButton:  {
        backgroundColor: '#062FFF',
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        borderRadius: 7,
        margin: 5,
        padding: 10,
    },
});