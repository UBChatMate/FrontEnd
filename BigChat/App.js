/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
 
import React, {Component} from 'react';
import {AppRegistry,Platform, StyleSheet, Text, View} from 'react-native';
import Login from './screens/Login/Login.js';
import ChatList from './screens/ChatList/ChatList.js';
import Contact from './screens/Contact/Contact.js';
import Chat from './screens/Chat/Chat.js';
import AddFriends from './screens/AddFriends/AddFriends.js';
import Testing from './screens/Testing/mediaTest.js';
import { createSwitchNavigator,  createStackNavigator } from 'react-navigation';


// export default class DemoLogin extends Component {
//   render() {
//     return (
//       <Login />
//     );
//   }
// }

export default class App extends React.Component {
  render() {
    return <AuthStack />;
  }
}
const AppStack = createStackNavigator(
  { Home: AddFriends,
    ChatList: ChatList, 
    Contact: Contact, 
    Logout: Login,
    Chat: Chat,
   },  
  {
     // Hides Header globally
     navigationOptions: {
      header: null,
     }
  }
 );

const AuthStack = createSwitchNavigator(
  {
    Login: Testing,
    App: AppStack,
  },
  {
    // Hides Header globally
    navigationOptions: {
      header: null,
    }
   },
  {
    initialRouteName: 'Login',
  }
);

const RootStack = createStackNavigator(
  {
    Home: {
      screen: Login,
      navigationOptions: {
        header: null // Will hide header for Home only
    }
    },
    Contact: Contact,
    ChatList: ChatList,
    Login: Login,
  },
  {
    // Hides Header globally
    navigationOptions: {
      header: null,
    }
   },
  {
    initialRouteName: 'Home',
  },
);


AppRegistry.registerComponent('DemoLogin', () => DemoLogin);
