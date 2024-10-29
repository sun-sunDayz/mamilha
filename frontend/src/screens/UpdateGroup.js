import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import GroupCategory from '../components/GroupCategory';
import GroupMember from '../components/GroupMember';
import UpdateMember from '../components/UpdateMember';
import Currency from '../components/Currency';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiClient from '../services/apiClient';

const UpdateGroup = ({route, navigation}) => {
  const [groupName, setGroupName] = useState('');
  const [groupCategory, setGroupCategory] = useState(null);
  const [currency, setCurrency] = useState('');
  const [members, setMembers] = useState([]);
  const [updateMembers, setUpdateMembers] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [modalWidth, setModalWidth] = useState(0);
  const scrollViewRef = useRef(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState(null);

  const group_pk = route.params.group_pk;

  useEffect(() => {
    apiClient
      .get(`/api/groups/${group_pk}/`)
      .then(response => {
        console.log(response.data)
        setCurrency(response.data.currency);
        setGroupCategory(response.data.category_id); // 기존 카테고리 설정
        setGroupName(response.data.name);
        setUpdateMembers(response.data.member);
        setInviteCode(response.data.invite_code);
      })
      .catch(error => {
        console.error('데이터를 불러오는데 실패했습니다', error);
      });
  }, []);

  const handleUpdateGroup = async () => {
    try {
      await apiClient.put(`/api/groups/${group_pk}/`, {
        name: groupName,
        category_id: groupCategory,
        currency: currency,
        new_members: members,
        update_members: updateMembers,
      });
      setMembers([]);
      setUpdateMembers([]);

      navigation.navigate('Main', {
        updatedGroupId: group_pk, // 수정된 그룹의 ID
        updatedGroupName: groupName, // 수정된 그룹 이름
        updatedGroupCategory: groupCategory, // 수정된 그룹 카테고리
        updatedGroupCurrency: currency, // 수정된 통화 정보
      });
    } catch (error) {
      alert(error.response.data.error);
    }
    setIsUpdateModalOpen(false);
  };

  const handleGoBack = () => {
    setMembers([]);
    setGroupName(groupName);
    setGroupCategory(groupCategory);
    setCurrency(currency);
    setUpdateMembers(updateMembers);
    navigation.goBack();
  };

  const handleAddMember = () => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  };

  // 그룹 삭제 핸들러
  const handleDeleteGroup = async () => {
    try {
      await apiClient.delete(`/api/groups/${group_pk}/`);
      navigation.navigate('Main', {
        deletedGroupId: group_pk,
      }); // 삭제 후 메인 화면으로 돌아가기
    } catch (error) {
      alert('그룹 삭제에 실패했습니다: ' + error.response.data.error);
    }
    setIsDeleteModalOpen(false);
  };

  const generateInviteCode = async () => {
    try {
      const response = await apiClient.post(`/api/groups/invite/`, {
        group_id: group_pk
      });
      const newCode = response.data.invite_code
      setInviteCode(newCode);
    } catch (error) {
      alert('초대코드 생성에 실패했습니다: ' + error.response.data.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={30} color="#616161" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>모임 정보</Text>
        </View>
        <TouchableOpacity onPress={() => setIsDeleteModalOpen(true)}>
          <Text style={styles.deleteText}>삭제</Text>
        </TouchableOpacity>
      </View>
      <View>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.ScrollViewContent}>
          <View style={styles.formRow}>
            <Text style={styles.label}>모임 이름</Text>
            <TextInput
              placeholder="모임 이름 입력"
              keyboardType="default"
              placeholderTextColor="#ADAFBD"
              style={styles.GroupNameInput}
              value={groupName}
              onChangeText={setGroupName}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>모임 카테고리</Text>
            <GroupCategory
              selectedCategory={groupCategory} // 기존에 선택된 카테고리 정보 전달
              onChangeCategory={setGroupCategory}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>초대코드</Text>
            <View style={styles.inviteCodeRow}>
              {inviteCode ? (
                <View style={styles.codeContainer}>
                  <View style={styles.inviteCodeBox}>
                    <Text style={styles.inviteCodeText}>{inviteCode}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => generateInviteCode()}
                    style={styles.inviteCodeButton}>
                    <Text style={styles.inviteCodeButtonText}>재발급</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => generateInviteCode()}
                  style={styles.inviteCodeButton}>
                  <Text style={styles.inviteCodeButtonText}>초대코드 생성</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>멤버</Text>
            <UpdateMember
              onUpdateMembers={setUpdateMembers}
              selectedMembers={updateMembers}
            />
            <GroupMember
              onChangeMembers={setMembers}
              onAddMember={handleAddMember}
            />
          </View>
        </ScrollView>
      </View>
      <TouchableOpacity
        onPress={() => setIsUpdateModalOpen(true)}
        style={styles.UpdateGroupButton}
        onLayout={event => {
          const {width} = event.nativeEvent.layout;
          setModalWidth(width);
        }}>
        <Text style={styles.UpdateGroupButtonText}>수정하기</Text>
      </TouchableOpacity>
      {isUpdateModalOpen && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isUpdateModalOpen}
          onRequestClose={() => setIsUpdateModalOpen(false)}>
          <TouchableOpacity
            style={styles.UpdateModalOverlay}
            activeOpacity={1}
            onPressOut={() => setIsUpdateModalOpen(false)}>
            <View style={[styles.updateModal, {width: modalWidth}]}>
              <Text style={styles.udateModalTitel}>
                모임 정보를 수정하시겠습니까?
              </Text>
              <View style={styles.udateModalButton}>
                <TouchableOpacity
                  onPress={() => setIsUpdateModalOpen(false)}
                  style={styles.udateModalButtonNo}>
                  <Text style={styles.udateModalButtonNoText}>아니오</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleUpdateGroup}
                  style={styles.udateModalButtonYes}>
                  <Text style={styles.udateModalButtonYesText}>네</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* 삭제 모달 */}
      {isDeleteModalOpen && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isDeleteModalOpen}
          onRequestClose={() => setIsDeleteModalOpen(false)}>
          <TouchableOpacity
            style={styles.UpdateModalOverlay}
            activeOpacity={1}
            onPressOut={() => setIsDeleteModalOpen(false)}>
            <View style={[styles.updateModal, {width: modalWidth}]}>
              <Text style={styles.udateModalTitel}>
                모임을 삭제하시겠습니까?
              </Text>
              <View style={styles.udateModalButton}>
                <TouchableOpacity
                  onPress={() => setIsDeleteModalOpen(false)}
                  style={styles.udateModalButtonNo}>
                  <Text style={styles.udateModalButtonNoText}>아니오</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeleteGroup}
                  style={styles.deleteModalButtonYes}>
                  <Text style={styles.udateModalButtonYesText}>네</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f9',
  },
  content: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
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
  deleteText: {
    fontSize: 16,
    color: '#616161',
  },
  TopContainer: {
    position: 'relative',
  },
  CloseIcon: {
    paddingHorizontal: 15,
  },
  TitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 7,
  },
  TitleText: {
    fontSize: 25,
    fontWeight: '700',
    textAlign: 'center',
  },
  GroupNameInput: {
    color: '#434343',
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    width: '95%',
    padding: 10,
    marginLeft: 8,
    borderRadius: 8,
  },
  ScrollViewContent: {
    padding: 10,
    paddingBottom: 150,
  },
  formRow: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  label: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    margin: 8,
  },
  UpdateGroupButton: {
    position: 'absolute',
    alignSelf: 'center',
    width: '90%',
    bottom: 50,
    padding: 13,
    backgroundColor: '#5DAF6A',
    borderRadius: 10,
    alignItems: 'center',
  },
  UpdateGroupButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  UpdateModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  updateModal: {
    borderWidth: 1,
    borderColor: '#cccccc',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
  },
  udateModalTitel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 30,
    color: '#434343',
  },
  udateModalButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  udateModalButtonNo: {
    width: '40%',
    alignItems: 'center',
    padding: 10,
  },
  udateModalButtonNoText: {
    color: '#5DAF6A',
    fontSize: 18,
    fontWeight: '700',
  },
  udateModalButtonYes: {
    width: '40%',
    alignItems: 'center',
    backgroundColor: '#5DAF6A',
    borderRadius: 10,
    paddingTop: 13,
    paddingBottom: 13,
  },
  deleteModalButtonYes: {
    width: '40%',
    alignItems: 'center',
    backgroundColor: '#FF5A5A',
    borderRadius: 10,
    paddingTop: 13,
    paddingBottom: 13,
  },
  udateModalButtonYesText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  MemberUserContainer: {
    borderRadius: 15,
    backgroundColor: '#ffffff',
    marginTop: 10,
    padding: 10,
    paddingLeft: 15,
    flexDirection: 'row',
  },
  MemberUserName: {
    fontSize: 16,
    color: '#000000',
  },
  MemberUserMe: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5DAF6A',
    marginLeft: 5,
  },
  inviteCodeRow: {
    alignItems: 'flex-start',
    marginLeft: 5,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inviteCodeBox: {
    backgroundColor: '#D9D9D9',
    borderRadius: 5, 
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  inviteCodeText: {
    fontSize: 16,
    color: '#434343',
  },
  inviteCodeButton: {
    backgroundColor: '#EDEDED',
    borderColor: '#AEAEAE',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  inviteCodeButtonText: {
    color: '#6C6C6C',
    fontSize: 16,
  },
});

export default UpdateGroup;
