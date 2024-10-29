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

const InviteGroupDetail = ({navigation, route}) => {
  const [members, setMembers] = useState([{member: 'name1'}, {member: 'name'}]);
  const inviteCode = route.params.inviteCode;

  const handleSelectMember = () => {
    console.log('select');
  };

  useEffect(() => {
    console.log('code:', inviteCode)
    
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={30} color="#616161" />
        </TouchableOpacity>
        <View>
          <CustomText style={styles.title}></CustomText>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.groupInfo}>
          <Text style={styles.mainTitle}>모임 정보</Text>
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
          <Text style={styles.memberTitle}>본인을 선택해주세요</Text>
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
            <Text>코드 {inviteCode}</Text>
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
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#f1f1f9',
  },
  closeIcon: {
    padding: 0,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 10,
  },
  memberTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginTop: 10,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginRight: 10,
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
    marginTop: 20,
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