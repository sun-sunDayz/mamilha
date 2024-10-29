import React, {useEffect, useContext, useState} from 'react';
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
import {UserContext} from '../userContext';

const InviteGroupDetail = ({navigation, route}) => {
  const currentUser = useContext(UserContext);
  const group_pk = route.params.group_pk;
  const groupName = route.params.group_name;
  const groupAdminName = route.params.group_admin_name;
  const [members, setMembers] = useState([]);
  const handleSelectMember = async (member_id) => {
    try {
      const response = await apiClient.put(
        `/api/groups/${group_pk}/members/account/`,
        {member_pk: member_id},
      );
      console.log('멤버 연동이 완료되었습니다', response);
    } catch (error) {
      console.error('데이터를 불러오는데 실패했습니다', error);
    }
  };

  const handleNewMember = async () => {
    navigation.navigate('InviteGroupDetailNew', {group_pk: result.group_id});
  };

  useEffect(() => {
    setMembers(route.params.members);
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
            <Text style={styles.contentTitle}>모임명</Text>
            <Text style={styles.contentText}>{groupName}</Text>
          </View>
          <View style={styles.contentMiddleView}>
            <Text style={styles.contentTitle}>모임장</Text>
            <Text style={styles.contentText}>{groupAdminName}</Text>
          </View>
        </View>
        <View style={[styles.ContentBottom, {paddingTop: 10}]}>
          <Text style={styles.memberTitle}>본인을 선택해주세요</Text>
          <View style={styles.memberContent}>
            {members &&
              members.map((member, index) => (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() => handleSelectMember(member.id)}>
                    <View style={styles.memberViewContent}>
                      <Icon name="person-circle" size={30} color="#5DAF6A" />
                      <Text style={styles.memberText}> {member.name}</Text>
                      <Text style={styles.statusLabel}>
                        {member.username ? '활성' : '비활성'}
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
            <TouchableOpacity
              style={styles.newMemberButton}
              onPress={() => handleNewMember()}>
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

  statusLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: '#888888',
    fontWeight: 'bold',
  },
});

export default InviteGroupDetail;
