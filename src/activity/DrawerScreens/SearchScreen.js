// Searching using Search Bar Filter in React Native List View
// http://aboutreact.com/react-native-search-bar-filter-on-listview/

// import React in our code
import React, { useState, useEffect } from 'react';

// import all the components we are going to use
import { SafeAreaView, Text, StyleSheet, View, FlatList } from 'react-native';
import { SearchBar } from 'react-native-elements';
import {connect} from "react-redux";
import {getAllProducts} from "../../actions/itemsAction";
const SearchScreen = (props) => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [allProducts,changeAllProducts] = useState(props.item.allProductsData);
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
    var found=0,index;
    for(var i=0;i<allProducts.length;i++)
     {
       if(allProducts[i].description === item.description)
        {
          found=1;
          index=[i];
          console.log("Product found and index is:-"+index)
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
      props.navigation.navigate("AddtoCartPage", {selectedProduct: item, varients: item.varients[0],index: index});
    }
    props.navigation.navigate("AddtoCartPage", {selectedProduct: allProducts[index], varients: item.varients[0],index: index});
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      
      <View style={styles.container}>
        <SearchBar
          round
          searchIcon={{ size: 20 }}
          onChangeText={(text) => searchFilterFunction(text)}
          onClear={(text) => searchFilterFunction('')}
          placeholder="Search Product..."
          value={search}
          lightTheme= {true}
          showLoading={true}
        />
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
      </View>
    </SafeAreaView>
  );
};
const mapStateToProps = (state) => {
  // console.log("State Contains:-"+ state)
  return({
      //Here State.post is 
      //Coming From -> "./reducers/index.js"
      //where "post" is defined under combineReducers
      item:state.item
  })
}
export default connect(mapStateToProps, {getAllProducts})(SearchScreen);
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  itemStyle: {
    padding: 10,
  },
});

// export default SearchScreen;
