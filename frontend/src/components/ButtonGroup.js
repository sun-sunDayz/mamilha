import React from 'react';
import {View, TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';

const ButtonGroup = ({onPressFirstButton, onPressSecondButton}) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={onPressFirstButton}>
        <AwesomeIcon name="plus" size={25} color="#5DAF6A" />
        <Text style={styles.buttonText}>모임 만들기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onPressSecondButton}>
        <AwesomeIcon name="group" size={25} color="#5DAF6A" />
        <Text style={styles.buttonText}>모임 초대받기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#000000',
    fontSize: 14,
    marginLeft: 10,
  },
});

export default ButtonGroup;
