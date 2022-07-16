import React from 'react';
import { Text, View ,TouchableOpacity,  Share,  Linking,

} from 'react-native';
import { EvilIcons, FontAwesome } from '@expo/vector-icons'; 

const ContactUs = () => {
  return (
  
    <View style={{
      flex: 1}}>
            {/* Phone */}
            <TouchableOpacity style={{backgroundColor:"#062FFF",width:"95%",marginTop:12 ,marginBottom:10,marginLeft:"auto",marginRight:"auto",padding:10,borderRadius:10}}
              onPress={() =>{
                let number = '';
                if (Platform.OS === 'ios') {
                number = 'telprompt:+91'+8178218314;
                }
                else {  
                number = 'tel:+91'+8178218314; 
                }
                Linking.openURL(number);
              }}
              >
        <Text style={{ color: '#ffffff', fontSize:18}}>Call Us</Text>    
            </TouchableOpacity>
                    
            {/* Whatsapp */}
            <TouchableOpacity style={{backgroundColor:"#062FFF",width:"95%",marginTop:12 ,marginBottom:10,marginLeft:"auto",marginRight:"auto",padding:10,borderRadius:10}}
              onPress={() => {
                let url= "whatsapp://send&phone=91"+8178218314
                Linking.openURL(url)
                .then(data => {
                  console.log("WhatsApp Opened successfully " + data);  //<---Success
                })
                .catch(() => {
                  alert("Make sure WhatsApp installed on your device");  //<---Error
                }); 
              }}
              >
                        <Text style={{ color: '#ffffff', fontSize:18}}>WhatsApp</Text>    

            </TouchableOpacity>

            {/* Share */}
            <TouchableOpacity style={{backgroundColor:"#062FFF",width:"95%",marginTop:12 ,marginBottom:10,marginLeft:"auto",marginRight:"auto",padding:10,borderRadius:10}}
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
           >
                        <Text style={{ color: '#ffffff', fontSize:18}}>Share</Text>    
            </TouchableOpacity>
          </View>
       
      );
}

export default ContactUs;