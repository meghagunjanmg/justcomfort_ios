import React,{useState,useEffect} from "react";
import { Dimensions, RefreshControl,  FlatList, StyleSheet, SafeAreaView,Modal, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, ImageBackground } from 'react-native';
import { AntDesign, Entypo, FontAwesome} from '@expo/vector-icons'; 
import {connect} from "react-redux";
import {getItems,getLocation,updatedCart,getUserData,getHomescreenData} from "../../actions/itemsAction";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from "react-native-simple-radio-button";
import { TextInput } from "react-native-gesture-handler";
import Toast from 'react-native-simple-toast';
import Loader from "../Components/Loader";

const Rewards = (props) => {
    const [loading, setLoading] = useState(false);
    const [reward, setReward] = useState(props.item.userdata.rewards);
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [id, setId] = useState(0);
    const [numCols, setNumCols] = useState(2);
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const [userrewards,setUserRewards]=useState([])
    const [allrewards,setAllRewards]=useState([])


    const [modalVisible1, setModalVisible1] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [showCard1,setShowCard1] = useState(true);
    const [showCard2,setShowCard2] = useState(false);
    const [showCard3,setShowCard3] = useState(false);


    useEffect(() => {
      if(data!==null)
    {  
      getData(); 
    }
      }, []);

      useEffect(() => {
        userdata()
        }, [data]);
  

      const onRefresh = () => {
       getData()
       userdata()
      };

      const userdata = ()=>{
        let dataToSend = {user_id: props.item.userdata.user_id};
        let formBody = [];
        for (let key in dataToSend) {
          let encodedKey = encodeURIComponent(key);
          let encodedValue = encodeURIComponent(dataToSend[key]);
          formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');
        
        fetch('http://justcomfort.umbeo.com/admin/api/userrewards', {
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
          if(responseJson.status==="1"){
            setUserRewards(responseJson.rewards)
            const rew = [];
            for (let i=0; i < data.length; i++) {
                // Try avoiding the use of index as a key, it has to be unique!
                rew.push(
                    data[i].reward_id
                );
            }
            for (let i=0; i < rew.length; i++) {
              for (let j=0; j < userrewards.length; j++) {
              if(rew[i] === userrewards[j]){
                console.log(rew[i])
                setShowCard3(true)
              }
            }
          }    
        }
        })
        .catch((error) => {
            console.error(error);
        });
      }
      const getData = () => {
        fetch('http://justcomfort.umbeo.com/admin/api/allrewards', {
          method: 'GET',
          headers: {
            //Header Defination
            'Content-Type':
            'application/x-www-form-urlencoded;charset=UTF-8',
          },
        })
        .then((response) => response.json())
        .then((responseJson) => {
if(responseJson.status=="1")
          { 
            setData(responseJson.rewards);
          
          }

        })
        .catch((error) => {
            console.error(error);
        });
      };   


    const redeemRewards = () =>{

        setLoading(true);
        var formdata = new FormData();
        formdata.append("user_id", props.item.userdata.user_id);

        var requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };

        fetch("http://justcomfort.umbeo.com/admin/api/redeem_rewards", requestOptions)
          .then(response => response.json())
          .then(async result => {
              console.log(result)
              await Toast.show(result.message);
              await updateWallet();
              setReward("0")
              setLoading(false)
          })
          .catch(error => console.log('error', error));
    }
    
    const updateWallet = () => {
      var formdata = new FormData();
      formdata.append("user_id",props.item.userdata.user_id );

      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };

      fetch("http://justcomfort.umbeo.com/admin/api/myprofile", requestOptions)
        .then(response => response.json())
        .then(async result => {
          console.log(result)
          await props.getUserData(result.data)
        })
        .catch(error => console.log('error', error));
    }
    return(
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
           <View>
              <ImageBackground source={require('../../../assets/cardbg.png')} style={styles.image}>
                        <Text style={styles.text}>Total Crystal</Text>
                        <Text style={styles.text}>{reward}</Text>
                        </ImageBackground>
                </View>
                <View style={styles.achieve}>
                    <Text>Achievements</Text>
                </View>
                
                <View>
 
                <FlatList 
            numColumns={numCols}
            enableEmptySections={true}
            data={data}
            refreshControl={
              <RefreshControl
                //refresh control used for the Pull to Refresh
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            keyExtractor= {(item) => {
              return item.id;
            }}
            renderItem={({item}) => {
              return (
                <View>
                
                  <View style={styles.rewardspoint}>

{showCard3 && userrewards.includes(item.reward_id) ?<TouchableOpacity 
    onPress={() => {
     setModalVisible3(!modalVisible3)
     setId(item)
     }}
    style={[styles.rewardsSection, {backgroundColor:"white"}]}>
    <Text style={[styles.gemsstyle,{fontWeight:"bold"}]}>{item.reward_name}</Text>
    <FontAwesome style={[styles.gemsstyleIcon,{marginTop:5,marginBottom:5,backgroundColor:"white"}]} name="diamond" color="#062FFF" size={20} />
    <Text style={styles.gemsstyle}><Text style={{color:"#062FFF",fontWeight:"bold"}}>{item.reward_point}</Text> Crystal</Text>
</TouchableOpacity>:
<TouchableOpacity 
    onPress={() =>  {
      setId(item)
      setModalVisible3(!modalVisible3)}}
    style={[styles.rewardsSection]}>
    <Text style={styles.gemsstyle}>{item.reward_name}</Text>
    <FontAwesome style={[styles.gemsstyleIcon,{marginTop:5,marginBottom:5}]} name="diamond" color="black" size={20} />
    <Text style={styles.gemsstyle}>{item.reward_point} Crystal</Text>
</TouchableOpacity>
}

<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible3}
  onRequestClose={() => {
    Alert.alert("Modal has been closed.");
    setModalVisible3(!modalVisible3);
  }}
>
  <View style={styles.centeredView}>
    <View style={styles.modalView}>
      <Text style={styles.modalText}>{id.reward_desc}</Text>
      <TouchableOpacity
        style={[styles.button, styles.buttonClose]}
        onPress={() => setModalVisible3(!modalVisible3)}
      >
        <Text style={styles.textStyle}>Ok</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
</View>
</View>
              
              )}}/>
              </View>
              
            <Loader loading={loading} />
               <View>
               <TouchableOpacity 
                    onPress={() => {
                        props.item.userdata.user_id?redeemRewards():props.navigation.navigate("Auth");
                    }}
                    style={styles.buttonStyle} 
                    activeOpacity={0.5}>
                  <Text style={styles.buttonTextStyle}>Redeem to Wallet</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </SafeAreaView>
    );
}
   


            
    {/*            <View style={[styles.rewardspoint,{marginBottom:5}]}>

                    {showCard1?
                    <TouchableOpacity 
                      onPress={() => setModalVisible1(!modalVisible1)}
                      style={[styles.rewardsSection, {marginLeft: 50,backgroundColor:"white"}]}>
                      <Text style={[styles.gemsstyle,{fontWeight:"bold"}]}>Early Starter</Text>
                      <FontAwesome style={styles.gemsstyleIcon,{backgroundColor:"white",alignSelf:"center",marginTop:5,marginBottom:5}} name="diamond" color="#062FFF" size={20} />
                      <Text style={styles.gemsstyle}><Text style={{color:"#062FFF",fontWeight:"bold"}}>100</Text> Crystal</Text>
                    </TouchableOpacity>:
                    <TouchableOpacity 
                      onPress={() => setModalVisible1(!modalVisible1)}
                      style={[styles.rewardsSection, {marginLeft: 50}]}>
                      <Text style={styles.gemsstyle}>Early Starter</Text>
                      <FontAwesome style={[styles.gemsstyleIcon,{marginTop:5,marginBottom:5}]} name="diamond" color="black" size={20} />
                      <Text style={styles.gemsstyle}>100 Crystal</Text>
                    </TouchableOpacity>
                    }
                    
                    
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible1}
                      onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible1(!modalVisible1);
                      }}
                    >
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <Text style={styles.modalText}>Get this reward on your first transaction!!</Text>
                          <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible1(!modalVisible1)}
                          >
                            <Text style={styles.textStyle}>Ok</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>

                    {showCard2?<TouchableOpacity 
                        onPress={() => setModalVisible2(!modalVisible2)}
                        style={[styles.rewardsSection , {backgroundColor:"white"}]}>
                        <Text style={[styles.gemsstyle,{fontWeight:"bold"}]}>Sparking Star</Text>
                        <FontAwesome style={[styles.gemsstyleIcon,{marginTop:5,marginBottom:5,backgroundColor:"white"}]} name="diamond" color="#062FFF" size={20} />
                        <Text style={styles.gemsstyle}><Text style={{color:"#062FFF",fontWeight:"bold"}}>500</Text> Crystal</Text>
                    </TouchableOpacity>:
                    <TouchableOpacity 
                      onPress={() => setModalVisible2(!modalVisible2)}
                      style={[styles.rewardsSection]}>
                      <Text style={styles.gemsstyle}>Sparking Star</Text>
                      <FontAwesome style={[styles.gemsstyleIcon,{marginTop:5,marginBottom:5}]} name="diamond" color="black" size={20} />
                      <Text style={styles.gemsstyle}>500 Crystal</Text>
                    </TouchableOpacity>
                    }
                    
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible2}
                      onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible2(!modalVisible2);
                      }}
                    >
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <Text style={styles.modalText}>Complete 10 transaction in a month to get this Reward!!</Text>
                          <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible2(!modalVisible2)}
                          >
                            <Text style={styles.textStyle}>Ok</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>

                </View>
          
                <View style={styles.rewardspoint}>

                    {showCard3?<TouchableOpacity 
                        onPress={() => setModalVisible3(!modalVisible3)}
                        style={[styles.rewardsSection, {marginLeft: 50,backgroundColor:"white"}]}>
                        <Text style={[styles.gemsstyle,{fontWeight:"bold"}]}>Hidden Gem</Text>
                        <FontAwesome style={[styles.gemsstyleIcon,{marginTop:5,marginBottom:5,backgroundColor:"white"}]} name="diamond" color="#062FFF" size={20} />
                        <Text style={styles.gemsstyle}><Text style={{color:"#062FFF",fontWeight:"bold"}}>1000</Text> Crystal</Text>
                    </TouchableOpacity>:
                    <TouchableOpacity 
                        onPress={() => setModalVisible3(!modalVisible3)}
                        style={[styles.rewardsSection, {marginLeft: 50}]}>
                        <Text style={styles.gemsstyle}>Hidden Gem</Text>
                        <FontAwesome style={[styles.gemsstyleIcon,{marginTop:5,marginBottom:5}]} name="diamond" color="black" size={20} />
                        <Text style={styles.gemsstyle}>1000 Crystal</Text>
                    </TouchableOpacity>}
                    
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible3}
                      onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible3(!modalVisible3);
                      }}
                    >
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <Text style={styles.modalText}>Complete 10 transaction above $100 in a month to get this Reward!!</Text>
                          <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible3(!modalVisible3)}
                          >
                            <Text style={styles.textStyle}>Ok</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>

                </View>
                   */}



      
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
export default connect(mapStateToProps, {updatedCart,getUserData})(Rewards);

const styles = StyleSheet.create({
  image: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center",
      height: 130,
      width: "100%",
      borderRadius: 10,
  },
  text: {
      color: "#000000",
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
  },
  rewardspoint: {
      flex: 1,
      flexDirection: "row",
  },
  rewardsSection:{
    maxWidth: Dimensions.get('window').width /2,
      backgroundColor: '#636060', 
      borderRadius: 10,
      padding: 4,
      margin: 25,
      width: 130,
      height: 130,
      textAlign: "center",
      marginLeft: 20,
      justifyContent: "center",
  },
  gemsstyle: {
      textAlign: "center",
      justifyContent: "center",
      marginTop: 5,
  },
  gemsstyleIcon: {
      textAlign: "center",
      marginTop: 5,
      backgroundColor: "#444343",
      borderRadius: 50,
      padding: 5,
      width: 40,
      marginLeft: 40,
  },
  achieve: {
      top: 1,
      margin: 10,
  },
  buttonStyle: {
      backgroundColor: '#062FFF',
      borderWidth: 0,
      color: '#FFFFFF',
      borderColor: '#7DE24E',
      height: 40,
      alignItems: 'center',
      borderRadius: 10,
      marginLeft: 35,
      marginRight: 35,
      marginTop: 20,
      marginBottom: 25,
  },
  buttonTextStyle: {
      color: '#FFFFFF',
      paddingVertical: 10,
      fontSize: 16,
      textAlign: 'center',
      fontWeight: 'bold',
  },
  centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width:"100%",
      marginLeft:"auto",
      marginRight:"auto",
      height:"100%",
      backgroundColor: '#00000040',

    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      width:150
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#062FFF",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
      fontSize:20,
      color:"grey"
    }
});