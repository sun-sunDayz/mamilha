import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
import apiClient from '../services/apiClient';
import CustomText from '../../CustomText';

const InviteGroupDetail = ({navigation, members}) => {
  // const [members, setMembers] = useState([]);

  const handleSelectMember = () => {
    console.log('select');
  };

  return (
    <SafeAreaView style={styles.Container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.CloseIcon}>
          <Ionicons name="chevron-back-outline" size={30} color="#616161" />
        </TouchableOpacity>
        <View>
          <CustomText style={styles.title}></CustomText>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.ContentTop}>
          <Text style={styles.contentTitle}>모임 정보</Text>
        </View>
        <View style={styles.contentMiddle}>
          <View style={styles.contentMiddleView}>
            <Text style={styles.contentTitle}>일시</Text>
            <Text style={styles.contentText}>가상의모임</Text>
          </View>
          <View style={styles.contentMiddleView}>
            <Text style={styles.contentTitle}>모임장</Text>
            <Text style={styles.contentText}>모임장닉네임</Text>
          </View>
        </View>
        <View style={[styles.ContentBottom, {paddingTop: 10}]}>
          <Text style={styles.contentTitle}>본인을 선택해주세요</Text>
          <View style={styles.memberContent}>
            {members &&
              members.map((member, index) => (
                <View key={index}>
                  <TouchableOpacity onPress={handleSelectMember}>
                    <View style={styles.memberViewContent}>
                      <Icon name="person-circle" size={30} color="#5DAF6A" />
                      <Text style={styles.memberText}>
                        {' '}
                        {member.member} {index}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        </View>
        <View>
          <View style={styles.newMemberView}>
            <Text style={styles.contentTitle}>해당하는 멤버가 없다면?</Text>
            <TouchableOpacity style={styles.newMemberButton}>
              <Text style={styles.newMemberButtonText}>클릭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.enterButton}>
        <Text style={styles.enterButtonText}>입장하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  Container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#f1f1f9',
  },
  TopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  CloseIcon: {
    padding: 0,
  },
  DeleteText: {
    fontSize: 16,
    right: 10,
    color: '#616161',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginRight: 10,
  },
  ContentTop: {},
  ContentTopView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ContentTopNum: {
    fontSize: 32,
    fontWeight: '700',
    color: '#434343',
  },
  ContentTopText: {
    fontSize: 20,
    top: 5,
    paddingLeft: 5,
    color: '#000000',
  },
  contentMiddle: {
    flex: 1,
  },
  contentMiddleView: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 16,
    color: '#000000',
  },
  enterButton: {
    position: 'absolute',
    alignSelf: 'center',
    width: '90%',
    bottom: 50,
    padding: 13,
    backgroundColor: '#5DAF6A',
    borderRadius: 10,
    alignItems: 'center',
  },
  enterButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  newMemberView: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  newMemberButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  newMemberButtonText: {
    color: '#5DAF6A',
    fontSize: 14,
    fontWeight: '700',
  },

  memberContent: {
    marginTop: 10,
  },
  memberViewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 5,
  },
  memberText: {
    alignItems: 'center',
    color: '#434343',
    fontSize: 16,
  },
});

export default InviteGroupDetail;
