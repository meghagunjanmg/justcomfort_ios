import { StyleSheet} from 'react-native';

const styles = StyleSheet.create({
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
      flex: 1, 
      backgroundColor: '#FFFFFF', 
      borderRadius: 7, 
      marginRight: 8,
    },
    trendingParentView: {
      position: 'absolute',
      right: 0,
      top: 0,
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
    trendingImageStyle:{
      padding: 10,
      margin: 5,
      borderRadius: 15,
      resizeMode: 'stretch',
      alignItems: 'center',
      width: 160,
      height: 120,
    },
    productBasicView:{
      margin: 5,
      textAlign: "left",
      color: '#000000', 
      fontSize: 20
    },
    productViewMore:{
      textAlign: "right", 
      alignItems: 'flex-end',
      right: 0,
      color: '#000000', 
      margin: 5,
      fontSize: 18
    },
    categorySection:{
      backgroundColor: '#FFFFFF',
      marginTop: 5,
    },
    trendingCategoryView:{
      flex: 1, 
      backgroundColor: '#F2EDED', 
      borderRadius: 7, 
      marginRight: 8,
      marginTop: 3,
      padding: 7,
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

  export {styles}