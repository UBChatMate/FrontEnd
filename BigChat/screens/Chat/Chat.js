import React, {Component} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import Backend from './backend';
//import ChatList from '../ChatList'
// const util = require ('util');
import UUIDGenerator from 'react-native-uuid-generator';

import{
    View,
    Text,
    StyleSheet,
    Image,
    Button,
    AsyncStorage,
} from 'react-native';


export default class Chat extends Component{
    static navigationOptions  = {
        //tabBarVisible = false,
       header : null
    };
    state = {
        user_name:"",
        messages: [],
        uuid:[], 
        isFetching: true,
    };

    componentWillMount() {

    }
    render(){
        var {navigate} = this.props.navigation;
        var {goBack} = this.props.navigation;
        if(this.state.isFetching){
            return(<View style = {{flex: 1}} >
                <View style={styles.toolbar}>
                    <Text onPress = {
                         ()=>goBack()
                    }
                    style={styles.toolbarButton} >Back</Text>

                    <Text style={styles.toolbarTitle}>Chat</Text>

                    <Text onPress = {
                         ()=>navigate("Profile",{})
                    }
                    style={styles.toolbarButton} >Profile</Text>
                </View>
                   
            </View>);
        }
        else
        return(
            <View style = {{flex: 1}} >
                <View style={styles.toolbar}>
                    <Text onPress = {
                         ()=>goBack()
                    }
                    style={styles.toolbarButton} >Back</Text>

                    <Text style={styles.toolbarTitle}>Chat</Text>

                    <Text onPress = {
                         ()=>navigate("Profile",{})
                    }
                    style={styles.toolbarButton} >Profile</Text>
                </View>
                <GiftedChat
                
                messages = {this.state.messages}
                onSend = {(text)=>{
                    this._sendMessage(text);
                }}
                user = {{name: this.state.user_name, _id: this.state.user_name}}/>
            </View>
            );
    }

    // _setUUID = async () =>{
    //     var i = 0;
    //     for( item of this.state.messages){ 
    //     // alert(i);
    //     await UUIDGenerator.getRandomUUID().then((uuid)=>{           
    //         this.state.uuid[i] = uuid;
    //         this.state.messages[i]._id = uuid;
    //         i++;
    //         alert(JSON.stringify(this.state.messages));
    //       })
    //     //   this.render();
    //     }
    //     alert("where");
    // };


    _retrieveData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                // We have data!!
                // console.log("Retrieving data...");
                // console.log(data);
                return value;
            }
        } catch (error) {
            alert(error);
            return null;
        }
    }

    _retrieveMessages = () => {
        this._retrieveData("userData").then((userData) => {
            userData = JSON.parse(userData);
            var chatId = this.props.navigation.state.params.chatId;
            try {
            let req = fetch("http://40.118.225.183:8000/chat/MessageHistory/?token=Token1&chatId=" + chatId , {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            }).then((response) => {

                messages = response._bodyText;
                messages = JSON.parse(messages);
                this.setState(
                    {
                        user_name: userData.email,
                        isFetching: false,
                        messages: messages.messages
                    });
                    for(i = 0; i<messages.messages.length;i++){
                        this.state.messages[i].text = messages.messages[i].message;
                        this.state.messages[i].createdAt = new Date(messages.messages[i].time);
                }
                // this._setUUID().then();
                this.render();

            });

        } catch (exp) {

            this.setState(
                {
                    isFetching: false,
                    messages: []
                });
        }

        });
    }

    _sendMessage = async(message) => {
        // for (let i = 0; i < message.length; i++) {
        //     this.messagesRef.push({
        //       text: message[i].text,
        //       user: message[i].user,
        //       createdAt: firebase.database.ServerValue.TIMESTAMP,
        //     });
        //   }
        var new_message = message[0];
        message = message[0].text;
        if(message == "" || message == null)
            return;
        // alert(message);
        this._retrieveData("userData").then((userData) => {
            userData = JSON.parse(userData);
            // alert(message);
            // alert(userData.email);

            var chatId = this.props.navigation.state.params.chatId;
            try {
            let req = fetch("http://40.118.225.183:8000/chat/MessageHistory/?token=Token1&chatId=" + chatId + "&message=" + message + "&type=1&email=" + userData.email, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
            }).then((response) => {
                try {
                let req = fetch("http://40.118.225.183:8000/chat/MessageHistory/?token=Token1&chatId=" + chatId , {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                }).then((response) => {
                    console.log("Inside fetching chatlist....");
                    messages = response._bodyText;
                    messages = JSON.parse(messages);
                    this.setState(
                        {
                            isFetching: false,
                            messages: GiftedChat.append(this.state.messages,new_message),

                            // messages: GiftedChat.append(messages.messages),
                        });   
    
                });
                this.render();
            } catch (exception) {
            this.setState(
                {
                    isFetching: false,
                    messages: []
                });
            this.render();
            }
            });
        } 
        catch (exp) {
        }
        });

    }
    // componentDidMount() {
    //     Backend.loadMessages((message) => {
    //         alert(JSON.stringify(message));
    //       this.setState((previousState) => {
    //         return {
    //           messages: GiftedChat.append(previousState.messages, message),
    //         };
    //       });
    //     });
    //   }
    componentDidMount() {
        this._retrieveMessages();
      }

    componentWillUnmount() {
        Backend.closeChat();
    }
}

  

const styles = StyleSheet.create({
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
      },
      toolbar:{
        backgroundColor:'#00bfff',
        paddingTop:40,
        paddingBottom:10,
        flexDirection:'row'    //Step 1
    },
  toolbarButton:{
      width: 50,            //Step 2
      color:'#fff',
      textAlign:'center',
      fontSize: 16,
  },
  toolbarTitle:{
      color:'#fff',
      textAlign:'center',
      fontWeight:'bold',
      fontSize: 25,
      flex:1                //Step 3
  }
  });