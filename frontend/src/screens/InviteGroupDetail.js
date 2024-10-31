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
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [isMemberConnected, setIsMemberConnected] = useState(false);

  const handleSelectMember = memberId => {
    setSelectedMemberId(memberId); // 선택된 멤버 ID를 설정
  };

  const handleNewMember = async () => {
    navigation.navigate('InviteGroupDetailNew', {
      group_pk: group_pk,
      group_name: groupName,
      group_admin_name: groupAdminName,
    });
  };

  const handleEnterGroup = async () => {
    if (!isMemberConnected) {
      // 입장하지 않은 경우 - 계정 연동
      try {
        const response = await apiClient.put(
          `/api/groups/${group_pk}/members/account/`,
          {member_pk: selectedMemberId},
        );
        console.log('멤버 연동이 완료되었습니다', response.data);
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다', error);
      }
    }
    navigation.navigate('Finances', {
      group_pk: group_pk,
      title: groupName,
    });
  };

  const canSelectMember = member => {
    return member.username === null;
  };

  const isDisabledEnter = () => {
    if(isMemberConnected) {
      return false;
    }
    return selectedMemberId === null;
  }

  const updateAccountConnected = async () => {
    try {
      const response = await apiClient.get(
        `/api/groups/${group_pk}/members/account/`,
      );

      result = response.data;
      setIsMemberConnected(result.exists === 1);
    } catch (error) {
      console.error('데이터를 불러오는데 실패했습니다', error);
    }
  };

  useEffect(() => {
    updateAccountConnected();
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
        {!isMemberConnected && (
          <View style={[styles.ContentBottom, {paddingTop: 10}]}>
            <Text style={styles.memberTitle}>본인을 선택해주세요</Text>
            <View style={styles.memberContent}>
              {members &&
                members.map((member, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() => handleSelectMember(member.id)}
                      disabled={!canSelectMember(member)}>
                      <View style={styles.memberViewContent}>
                        <Ionicons
                          name={
                            selectedMemberId === member.id
                              ? 'checkmark-circle' // 선택된 경우 체크박스
                              : 'checkmark-circle-outline'
                          }
                          size={30}
                          color={canSelectMember(member) ? '#5DAF6A' : '#CCCCCC'} // 선택 가능 여부에 따라 색상 변경
                        />
                        <Text style={styles.memberText}>{member.name}</Text>
                        <Text style={styles.statusLabel}>
                          {member.username ? '연동 중' : ''}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          </View>
        )}
        <View>
          {!isMemberConnected && (
            <View style={styles.newMemberView}>
              <Text style={styles.contentTitle}>해당하는 멤버가 없다면?</Text>
              <TouchableOpacity
                style={styles.newMemberButton}
                onPress={() => handleNewMember()}>
                <Text style={styles.newMemberButtonText}>클릭</Text>
              </TouchableOpacity>
            </View>
          )}

          {isMemberConnected && (
            <View style={styles.newMemberView}>
              <Text style={styles.contentTitle}>이미 입장한 모임입니다</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[
          styles.enterButton,
          isDisabledEnter() && styles.disabledEnterButton,
        ]}
        onPress={handleEnterGroup}
        disabled={isDisabledEnter()}>
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
  disabledEnterButton: {
    backgroundColor: '#CCCCCC',
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
