import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';

const ListItem = ({ onPress, title, leader, members }) => {
  return (
    <TouchableOpacity style={styles.list} onPress={onPress}>
        <Ionicon name="barbell" size={30} color="#5DAF6A"/>
      <View style={styles.listContainer}>
        <Text style={styles.listText}>{title}</Text>
        <View style={styles.listContainer2}>
          <View style={styles.listContainer3}>
            <Text style={styles.listTextSubTitle}>모임장</Text>
            <Text style={styles.listTextSub}>{leader}</Text>
          </View>
          <View style={styles.listContainer3}>
            <Text style={styles.listTextSubTitle}>멤버</Text>
            <Text style={styles.listTextSub}>{members}</Text>
          </View>
        </View>
      </View>
      <EntypoIcon name="chevron-thin-right" size={15} color="#000" style={styles.buttonImage}/>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF', // 배경색을 흰색으로 설정
    borderRadius: 5,
    marginBottom: 15,
    width: '80%',
  },
  listImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  listText: {
    fontSize: 16,
    color: '#000000', // title 텍스트 색상을 검정색으로 설정
  },
  listContainer: {
    marginLeft: 10,
  },
  listContainer2: {
    flexDirection: 'row',
    marginTop: 5,
  },
  listContainer3: {
    flexDirection: 'row',
    marginRight: 20,
  },
  listTextSubTitle: {
    fontSize: 14,
    color: '#888888', // subtitle 색상 예시
    fontWeight: 'bold',
    marginRight: 5,
  },
  listTextSub: {
    fontSize: 14,
    color: '#000000', // subtitle 텍스트 색상도 검정색으로 설정
  },
  buttonImage: {
    width: 20,
    height: 20,
    marginLeft: 'auto',
  },
});

export default ListItem;

