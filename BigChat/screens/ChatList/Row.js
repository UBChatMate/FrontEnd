import React, {Component} from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        marginLeft: 12,
        fontSize: 20,
    },
    textRead: {
      textAlign: 'right',
      marginRight:10,
      marginLeft: 150,
      fontWeight: 'bold',
      fontSize: 16,
      justifyContent: 'flex-end',
  },
    photo: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
});
  
class Row extends React.Component {
  render() {

      const unread = <Text style={styles.textRead}>unread</Text>;

      let message;
      if (this.props.flag) {
          // alert("here");
          message = unread;
      } else {
        // alert("here2");
          message = null;
      }

      return (
      <View style={styles.container}>
        <Image source={{ uri: 'data:image/jpeg;base64,'+this.props.image}} style={styles.photo} /> 
        <Text style={styles.text}>
          {`${this.props.name}`}
          {"\n"}
          {`${this.props.message}`}
        </Text>
        <View >{message}</View>
      </View>);
  }
}
  // const Row = (props) => (
  //   <View style={styles.container}>
  //     {/* <Image source={{ uri: props.picture.large}} style={styles.photo} /> */}
  //     <Text style={styles.text}>
  //       {`${props.name}`}
  //       {"\n"}
  //       {`${props.message}`}
  //     </Text>

  //       <Text style={styles.textRead}> unread </Text>

  //   </View>
  // );

export default Row;

