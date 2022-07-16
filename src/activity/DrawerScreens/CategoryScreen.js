import React, { useEffect, useState, Component } from 'react';
import { SafeAreaView,
  LayoutAnimation,
  StyleSheet,
  View,
  Text,
  ScrollView,
  UIManager,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Image,
  ImageBackground } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import {connect} from "react-redux";
import {getCategoriesData} from "../../actions/itemsAction.js";

const ExpandableComponent = ({item, onClickFunction,navigation,propValues}) => {
  //Custom Component for the Expandable List
  const [layoutHeight, setLayoutHeight] = useState(0);

  useEffect(() => {
    if (item.isExpanded) {
      setLayoutHeight(null);
    } else {
      setLayoutHeight(0);
    }
  }, [item.isExpanded]);

  const show_Selected_Category = (items,lati,longi) => {
    // Write your code here which you want to execute on sub category selection.
    navigation.navigate("ProductScreen", {screen: "ProductsScreen", params: {title: items.title}})
  }
 
  return (
    <View style={styles.Panel_Holder}>
      {/*Header of the Expandable List Item*/}
      <ImageBackground source={require('../../../assets/cardbg.png')} style={styles.imageBackground}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClickFunction}
            style={styles.category_View}>
              <Image
style={styles.image}
    source={ item.image
        ? {uri: item.image}                      // Use object with 'uri'
        : require('../../../assets/ic_launcher.png')} // Or use require call directly
/>
  
              <Text style={styles.category_Text}>
                {item.title}
              </Text>
          </TouchableOpacity>
      </ImageBackground>
      <View style={{height: layoutHeight,overflow: 'hidden'}}>
        {/* Content under the header of the Expandable List Item*/}
        {item.subcategory.map((items, key) => (
          <TouchableOpacity
            key={key}
            style={styles.sub_Category_Text}
            onPress={ () => show_Selected_Category(items,propValues.latitude,propValues.longitude)}>
              <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:"grey"}}>
                <Text style={[styles.text,{flex:3,alignSelf:"flex-end"}]}>{items.title} </Text>
                <Image
                style={{flex:1,width:50,height:50,marginBottom:5,borderRadius:10}}
    source={items.image
        ? {uri: items.image}                      // Use object with 'uri'
        : require('../../../assets/ic_launcher.png')} // Or use require call directly
/>
              </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const CategoryScreen = (props) => {
  const [accordionData, setAccordionData] = useState(props.item.categoriesData);
  const [loading, setloading] = useState(true);
  const [multiSelect, setMultiSelect] = useState(false);

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  useEffect(() => {
    _getCategoriesList();
  }, []);

  const _getCategoriesList = async () => {
    let response = await fetch(
      'http://justcomfort.umbeo.com/admin/api/catee'
    );
    let json = await response.json();
    let categoryResponseData = json.data;
    categoryResponseData.forEach(categories => {categories.isExpanded = false;});
    //var tempArray = accordionData;
    //tempArray.push(categoryResponseData);
    setAccordionData(categoryResponseData);
    props.getCategoriesData(accordionData);
    setloading(false);
  }

  const updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...accordionData];
    if (multiSelect) {
      // If multiple select is enabled
      array[index]['isExpanded'] = !array[index]['isExpanded'];
    } else {
      // If single select is enabled
      array.map((value, placeindex) =>
        placeindex === index
          ? (array[placeindex]['isExpanded'] =
             !array[placeindex]['isExpanded'])
          : (array[placeindex]['isExpanded'] = false),
      );
    }
    setAccordionData(array);
  };

    if (loading) 
    {
      // console.log("if statement called");
      return (
        <View style={styles.spinnerView}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }else{
      return (
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.MainContainer}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 5 }}>
              {accordionData.map((item, key) => (
                <ExpandableComponent
                  key={item.cat_id}
                  onClickFunction={() => {
                    updateLayout(key);
                  }}
                  item={item}
                  propValues={props.item}
                  navigation={props.navigation}
                />
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      );
    }
}

const mapStateToProps = (state) => {
  // console.log(state.item.latitude)
  return({
      //Here State.post is 
      //Coming From -> "./reducers/index.js"
      //where "post" is defined under combineReducers
      item:state.item
  })
}
export default connect(mapStateToProps, {getCategoriesData})(CategoryScreen);

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: (Platform.OS === 'ios') ? 20 : 20,
    backgroundColor: '#F5FCFF',
  },
  iconStyle: {
    width: 30,
    height: 30,
    justifyContent: 'flex-end',
    alignItems: 'center',
    tintColor: '#fff',
  },
  sub_Category_Text: {
    fontSize: 18,
    color: '#000',
    padding: 10
  },
  category_Text: {
    textAlign: 'left',
    color: '#fff',
    fontSize: 16,
    padding: 10,
    right: 0,
  },
  category_View: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
  Btn: {
    padding: 10,
    backgroundColor: '#FF6F00'
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
  image :{
    width: 50,
    height:50,
    margin: 10,
    alignItems: "center"
  },
  container: {
    flex: 1,
  },
  titleText: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000'
  },
  text: {
    fontSize: 16,
    color: '#606070',
    padding: 10,
    paddingTop:0
  },
  content: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
  },
  spinnerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    height: 60,
    width: "100%",
    borderRadius: 10,
    marginTop: 10,
},
});