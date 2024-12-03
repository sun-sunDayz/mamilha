import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

const GroupListItem = ({ onPress, title, leader, members, icon, icon_color, currentUserID }) => {
  useEffect(() => {
  }, []);

  // 제목 15자 이상 시 ...으로 표시
  const truncateText = (text, limit) => {
    if (text.length > limit) {
      return text.substring(0, limit) + '...';
    }
    return text;
  };

  return (
    <TouchableOpacity style={styles.list} onPress={onPress}>
      <Ionicon name={icon} size={30} color={`#${icon_color}`} />
      <View style={styles.listContainer}>
        <Text style={styles.listText}>{truncateText(title, 15)}</Text>
        <View style={styles.listContainer2}>
          <View style={styles.flexTitle}>
            <Text style={styles.listTextSubTitle}>모임장</Text>
          </View>
          <View style={styles.flexLeader}>
            <Text style={styles.listTextSub}>{leader["userName"]}</Text>
            {currentUserID === leader.userID && (
              <Text style={styles.listTextMe}>(나)</Text>
            )}
          </View>
          <View style={styles.flexTitle}>
            <Text style={styles.listTextSubTitle}>멤버</Text>
          </View>
          <View style={styles.flexMember}>
            <Text style={styles.listTextSub}>{members}</Text>
          </View>
        </View>
      </View>
      <Ionicon
        name="chevron-forward-outline"
        size={20}
        color="#ADAFBD"
        style={styles.buttonImage}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF', // 배경색을 흰색으로 설정
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 5,
  },
  listText: {
    fontSize: 16,
    color: '#000000', // title 텍스트 색상을 검정색으로 설정
    fontWeight: '600',
  },
  listContainer: {
    marginLeft: 10,
    flex: 1,
  },
  listContainer2: {
    flexDirection: 'row',
    marginTop: 5,
  },
  flexTitle: {
    flex: 2,
  },
  flexLeader: {
    flex: 5,
    flexDirection: 'row',
  },
  flexMember: {
    flex: 2,
  },
  listTextSubTitle: {
    fontSize: 14,
    color: '#616161',
    fontWeight: 'bold',
    marginRight: 5,
  },
  listTextSub: {
    textAlign: 'left',
    fontSize: 14,
    color: '#616161',
  },
  listTextMe:{
    color: '#5DAF6A',
    fontSize: 14,
    marginLeft: 2,
    fontWeight: '700',
  },
  buttonImage: {
    width: 20,
    height: 20,
    marginLeft: 'auto',
  },
});

export default GroupListItem;
