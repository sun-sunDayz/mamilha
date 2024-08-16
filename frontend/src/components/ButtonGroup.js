import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const ButtonGroup = ({onPressFirstButton}) => {
  const navigation = useNavigation();

  const handleCreateGroup = () => {
    navigation.navigate(onPressFirstButton);
  };

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={handleCreateGroup}>
        <AwesomeIcon name="plus" size={25} color="#FFFFFF" />
        <Text style={styles.buttonText}>모임 만들기</Text>
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
    justifyContent: 'center', 
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#5DAF6A',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 10, 
  },
});

export default ButtonGroup;

