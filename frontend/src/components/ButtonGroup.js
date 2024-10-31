import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ButtonGroup = ({nickname}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.buttonCreateGroup}
        onPress={() => navigation.navigate("CreateGroup",{nickname: nickname})}>
        <Ionicons name="add-outline" size={20} color="#FFFFFF" />
        <Text style={styles.buttonCreateGroupText}>모임 만들기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonInviteGroup}
        onPress={() => navigation.navigate("InviteGroup")}>
        <Ionicons name="people" size={20} color="#5DAF6A" />
        <Text style={styles.buttonInviteGroupText}>모임 초대받기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  buttonCreateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 16,
    backgroundColor: '#5DAF6A',
    borderRadius: 10,
    flex: 1,
    marginRight: 15,
  },
  buttonInviteGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flex: 1,
  },
  buttonCreateGroupText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    marginLeft: 10,
  },
  buttonInviteGroupText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ButtonGroup;
