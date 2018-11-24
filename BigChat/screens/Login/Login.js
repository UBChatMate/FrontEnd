import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Image, AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';


import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { LoginButton, AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';


var FBLoginButton = require('./FBLoginButton');
var GoogleLoginButton = require('./GoogleLoginButton');


class Login extends Component {

  _logOut = async () => {

    var authType = this._retrieveData("userData").authType;

    if (authType === "facebook") {

      // Facebook logout
      LoginManager.logOut();
    } else if (authType === "google") {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        var data = {
          name: "", // Name
          email: "", // Email Address
          user_id: "",   // User's Name
          app_id: "", // app_id (FB or Google)
          token: "", // Authentication Token
          authType: "",   // Token issuer (FB or Google)
        }
        // Clearing AsyncStorage
        this._storeData("userData", JSON.stringify(data));
        this._storeData("logInStatus", "false");

      } catch (error) {
        console.error(error);
      }

    } else {

      console.log("Not logged into either facebook or google...");

    }

    this.props.navigation.navigate("Logout");

  }

  _storeData = async (key, value) => {
    try {
      console.log("Storing data...");
      console.log(value);
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log(error);
    }
  }

  _retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // We have data!!
        console.log("Retrieving data...");
        console.log(data);
        return value;
      }
    } catch (error) {
      console.log(error);
    }
  }

  _isLoggedIn = async () => {


    console.log("Checking if logged in...");

    try {
      const data = await this._retrieveData('logInStatus');

      if (data != null && data == "true") {

        console.log("LoggedIn: Navigating to App...");

        this.props.navigation.navigate("App");

      } else {
        console.log("Not LoggedIn.");
      }

    } catch (error) {
      console.log(error);
    }


  }

  _loginSuccess = async (data) => {

    console.log("Inside _loginSuccess");
    console.log(data);

    this._storeData("userData", JSON.stringify(data));
    this._storeData("logInStatus", "true");

    this.props.navigation.navigate("App");

    console.log("Navigating to App...");

    try {
      let req = await fetch('http://40.118.225.183:8000/auth/authenticate/?email=' + data.email + '&token=' + data.token + '&authType=' + data.authType, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      });

    } catch (exception) {
      alert("Unable to log into BigChat." + exception)
    }


  }

  // var req = fetch('https://mywebsite.com/endpoint/', {
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     firstParam: 'yourValue',
  //     secondParam: 'yourOtherValue',
  //   }),
  // });


  isGoogleSignedIn = async () => {
    console.log("Checking google login...");
    const isSignedIn = await GoogleSignin.isSignedIn();

    // console.log(isSignedIn);

    return isSignedIn;
  };

  isFacebookSignedIn = async () => {

    var isSignedIn;

    await AccessToken.getCurrentAccessToken().then((tokenInfo) => {
      console.log("Checking fb login...");
      isSignedIn = tokenInfo;
    });
    //  console.log(isSignedIn);

    return isSignedIn;

  }



  render() {

    this._isLoggedIn();
    return (
      <View style={styles.container}>
        <Image resizeMode="contain" style={styles.logo} source={require('./BigChatLogo.png')} />
        <Text style={styles.label1}>Log into BigChat</Text>
        <Text style={styles.label2}>using either Facebook or Google!</Text>
        <FBLoginButton style={styles.loginButtons} onLogin={this._loginSuccess} />
        <GoogleLoginButton style={styles.loginButtons} onLogin={this._loginSuccess} />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#81c04d',
  },
  label1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  label2: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black'
  },
  loginButtons: {
    fontSize: 16,
    fontWeight: 'normal',
    marginBottom: 20,
    width: "100%",
  },
  logo: {
    width: 300,
    height: 100
  }
});

export default Login;