import React, { useState, useEffect } from 'react';

// import all the components we are going to use
import { Alert,SafeAreaView, Text, StyleSheet, View, FlatList,TouchableOpacity,Image } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { TextInput } from 'react-native-paper';
import { add } from 'react-native-reanimated';
import {connect} from "react-redux";
import {updatedCart,getAllProducts} from "../../actions/itemsAction.js";

var jsonArray = [];
var found=0,index;

const InstantCartItem = (props) => {
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [addeddata, setaddeddata] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const [allProducts,changeAllProducts] = useState(props.item.allProductsData);
    var [cartItemsArray,changeCartItemsArray] = useState(props.item.cartItems);

    const [selected,changeselected] = useState([]);

    const [unit,changeunit] = useState();
    const [value, onChangeText] = useState('0');


    useEffect(() => {
     console.log("I am Called");
      console.log(props.item.latitude);
      let dataToSend = {lat: props.item.latitude, lng: props.item.longitude, city: '', keyword:''};
      let formBody = [];
      for (let key in dataToSend) {
        let encodedKey = encodeURIComponent(key);
        let encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      console.log(formBody);
  
      fetch('http://justcomfort.umbeo.com/admin/api/search', 
      {
        method: 'POST',
        body: formBody,
        headers: 
        {
          //Header Defination
          'Content-Type':
          'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then((response) =>{
        console.log("I am called 2")
        return(response.json())})
        .then((responseJson) => {
          console.log(`data of search as response ${responseJson}`);
          // If server response message same as Data Matched
          if (responseJson.status === '1') {
            //AsyncStorage.setItem('user_id', responseJson.data.email);
            console.log(responseJson.status);
            setMasterDataSource(responseJson.data);
          } else {
            setErrortext(responseJson.message);
            console.log('Please check your network connection');
          }
        })
        .catch((error) => {
          //Hide Loader
          console.error(error);
        });
    }, []);
  

    quantityHandler = (action, partOf, desc,index,qty) => {
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
          console.log(addeddata);

          // const indexInCart = cartItemsArray.findIndex(element => element.description === desc); //finding index of the item
          var indexInCart = null;

          for(var i=0;i<cartItemsArray.length;i++)
        if(cartItemsArray[i].description === desc)
          indexInCart = [i];
      console.log(`Index is:- ${indexInCart}`);

             if(indexInCart === null)
          {
            console.error(index);
            console.error(desc);

            var tempArray=cartItemsArray;
            var dataToBePushed = index;
            tempArray.push(dataToBePushed);
            changeCartItemsArray(tempArray);
            
            console.error(cartItemsArray);
            props.updatedCart(cartItemsArray,partOf,desc);
          
          }
          //Item is already present in cart -> then update the qty
          else
          {
            //Updating the Cart's qty of that item
            console.log(`Item ${cartItemsArray[indexInCart].description} already present with qty = ${cartItemsArray[indexInCart].qty}`)
            var updateQty = cartItemsArray[indexInCart].qty;
            updateQty= qty;
            var tempArray = cartItemsArray;
            tempArray[indexInCart].qty = updateQty; 
            changeCartItemsArray(tempArray);
            props.updatedCart(cartItemsArray,partOf,desc);
            console.log(`New Qty is = ${cartItemsArray[indexInCart].qty}`)
    
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
      
            // //new Added Here
            // console.log(`Item is :- ${allProducts[index].description} with Qty :- ${allProducts[index].qty} and TotalQuantity :- ${allProducts[index].quantity}`);
            // tempArray=allProducts;
            // tempArray[index].qty = updateQty;
            // tempArray[index].quantity = tempArray[index].quantity + 1;
            // changeAllProducts(tempArray);
            // props.getAllProducts(allProducts);
            // console.log(`Item is :- ${allProducts[index].description} with Qty :- ${allProducts[index].qty} and TotalQuantity :- ${allProducts[index].quantity}`);
            // // console.log(`now the cart item are:- ${cartItemsArray} with qty :- ${cartItemsArray[indexInCart].qty}`)
            // console.log("");
          
          
        }
      }

    const searchFilterFunction = (text) => {
      // Check if searched text is not blank
      if (text) {
        // Inserted text is not blank
        // Filter the masterDataSource
        // Update FilteredDataSource
        const newData = masterDataSource.filter(function (item) {
          const itemData = item.product_name
            ? item.product_name
            : ''.toUpperCase();
          const textData = text;
          return itemData.indexOf(textData) > -1;
        });
        setFilteredDataSource(newData);
        setSearch(text);
      } else {
        // Inserted text is blank
        // Update FilteredDataSource with masterDataSource
        setFilteredDataSource(masterDataSource);
        setSearch(text);
      }
    };
  
    const ItemView = ({ item }) => {
    
      return (
        // Flat List Item
        <Text style={styles.itemStyle} onPress={() => getItem(item)}>
          {item.product_name}
        </Text>
      );
    };

    const additem = () =>{
        let tempArray = selected;
        selected.map(index =>{
            if(search===index.product_name)
          {
            let temp = index;
            temp.qty = value;
            tempArray.push(temp); 

            setaddeddata(tempArray)

            var tem = tempArray.filter((tempArray, index, self) =>
            index === self.findIndex((t) => (t.product_id === tempArray.product_id)))
          
          
            setaddeddata(tem)

            console.error(addeddata);
          }
        })
        searchFilterFunction('')
        changeunit('')
        onChangeText('0')
      }



      const add = () => {
    
        addeddata.map(index => { quantityHandler('more', "productDataArray" ,index.description,index,index.qty)
        })
      }

    const ItemView1 = ({ item }) => {
        return (
          <View style={{flexDirection:"row"}}>
          <TouchableOpacity onPress={() => {/*this.props.navigation.navigate('ProductDetails', {productDetails: item})*/}} style={{padding: 10,flex: 1,}}>
            <Image source={{uri: item.product_image}} style={{height:80,width:80}}/>
          </TouchableOpacity>
          <View style={{alignSelf: 'center',flex: 3,marginLeft:20}}>
            <Text  >{item.product_name}</Text>
            <Text  >{item.description ? item.description : ''}</Text>
            <Text  >{item.price}</Text>
           
          </View>

<View style={{flex:1}}>
                  <View style={{position:"absolute",right:20}}>
								  	<TouchableOpacity onPress={() => 
                   { var k = addeddata.indexOf(item);
                    var k1 = selected.indexOf(item);
                    selected.splice(k1,10);
                    addeddata.splice(k, 10);
                    console.log("index"+k);
                    console.log(addeddata);
                    console.log(selected)
                    deleteHandler("",item.description,k)
                 
                       }   }>
								  		<Text style={{color:"#062FFF",fontSize:20}}>x</Text>
								  	</TouchableOpacity>
								  </View>
                  </View>
</View>
        );
      };
    
      const deleteHandler = (partOf,desc,index) => {
        Alert.alert(
          'Are you sure you want to delete this item from your cart?',
          '',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'Delete', onPress: () => {
              let updatedCart = cartItemsArray; /* Clone it first */
              var indexInCart = null;
              for(var i=0;i<cartItemsArray.length;i++)
                if(cartItemsArray[i].description === desc)
                  indexInCart = [i];
              props.updatedCart(updatedCart,partOf,desc);
            
             
              updatedCart.splice(indexInCart, 1); /* Remove item from the cloned cart state */
              //this.setState(updatedCart); /* Update the state */
              changeCartItemsArray(updatedCart); // set new state
              props.updatedCart(updatedCart,partOf,desc);
              console.log(`The data in cart is :- ${cartItemsArray}`);
            }},
          ],
          { cancelable: false }
        );
      } 
    const ItemSeparatorView = () => {
      return (
        // Flat List Item Separator
        <View
          style={{
            height: 0.5,
            width: '100%',
            backgroundColor: '#C8C8C8',
          }}
        />
      );
    };
  
    const getItem = (item) => {
      
      // Function for click on an item
      console.log(item);
      console.log('Id : ' + item.product_id + ' Title : ' + item.product_name);
      console.log(item.varients[0]);
      for(var i=0;i<allProducts.length;i++)
       {
         if(allProducts[i].description === item.description)
          {
            found=1;
            index=[i];
            console.log("Product found and index is:-"+index)
            changeunit(item.unit)
            setSearch(item.product_name)
            selected.push(item)
            console.error(selected);

          }
      }
      if(found===0)
      {
        var temp = allProducts;
        item.qty = 0 ;
        temp.push(item);
        changeAllProducts(temp);
        props.getAllProducts(allProducts);
        index=allProducts.length-1;
        console.log("Product not found but new index is:-"+index);
      }
    };
  
    return (
      <SafeAreaView style={{ flex: 1 }}>
      
               <View
           style={styles.topbar} >
        <View style={styles.container}>
          <SearchBar 
            round
            searchIcon={{ size: 20 }}
            onChangeText={(text) => searchFilterFunction(text)}
            onChange={(text) => searchFilterFunction(text)}

            onClear={(text) => searchFilterFunction('')}
            placeholder="Search Product..."
            value={search}
            lightTheme= {true}
            showLoading={true}
          />
          { search !== ''?
            <FlatList
            data={filteredDataSource.slice(0, 4)}
            initialNumToRender={4}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
          />:<View></View>}
           </View>

           <View style={{flexDirection:'row',alignItems:'center',margin:8}}>
           <View>
            <TextInput placeholder='Quantity' keyboardType='numeric' 
             onChangeText={text => onChangeText(text)}
             value={value}
             ></TextInput>
        </View>
        <View style={{alignItems:'center',alignContent:'center',justifyContent:'center',margin:8}}>
            <Text style={{fontSize:18}}>unit: {unit}</Text>
        </View>
        </View>
        <View style={{position: 'absolute',
        margin: 16,
        right: 10,
        bottom: 10}}>
        <TouchableOpacity style={{backgroundColor:"#062FFF",padding:10,borderRadius:10}}
              onPress={() =>{
                    additem()
              }}
              >
        <Text style={{ color: '#ffffff', fontSize:18}}>Add Item</Text>    
            </TouchableOpacity>
            </View>
            </View>
  
           
        <FlatList
            data={addeddata}
            keyExtractor= {(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView1}
  />

          <View style={{flexDirection:'row',justifyContent:'center'}}>
          <TouchableOpacity style={{backgroundColor:"#062FFF",padding:10,borderRadius:10,margin:12}}
              onPress={() =>{
               add();
              }}
              >
        <Text style={{ color: '#ffffff', fontSize:18}}>Add To Cart</Text>    
            </TouchableOpacity>
<TouchableOpacity style={{backgroundColor:"#062FFF",padding:10,borderRadius:10,margin:12}}
              onPress={() =>{
               setaddeddata([])
                changeselected([])
               
              }}
              >
        <Text style={{ color: '#ffffff', fontSize:18}}>Delete all</Text>    
            </TouchableOpacity>
            </View>
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
export default connect(mapStateToProps, {updatedCart,getAllProducts})(InstantCartItem);

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
      },
      itemStyle: {
        padding: 10,
      },
      topbar: {
        marginTop: 20,
        marginBottom:10,
        marginLeft:"auto",
        marginRight:"auto",
        width:"95%", 
        height: "auto" ,
        backgroundColor:"white",
        padding:10,
        borderRadius:5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,  
        elevation: 10,
        // flex:1,
      },
    });