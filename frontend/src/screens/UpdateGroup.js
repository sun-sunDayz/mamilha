import React, { useState, useRef, useEffect } from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Modal,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons'
import GroupForm from '../components/GroupForm';

  const UpdateGroup = ({ route, navigation }) => {
    const group_pk = route.params.group_pk;
    const initialData = route.params.initialData;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [modalWidth, setModalWidth] = useState(0);

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


    return (
      <SafeAreaView style={styles.Container}>
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

        <GroupForm group_pk={group_pk} screenName={'UpdateGroup'} initialData={initialData} />
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
            <View style={[styles.updateModal,]}>
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
  }

  const styles = StyleSheet.create({
    Container: {
      flex: 1,
      paddingTop: 10,
      backgroundColor: '#f1f1f9',
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
    UpdateModalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.2)',
    },
    updateModal: {
      width: '80%',
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
  });

  export default UpdateGroup;
