import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Modal,
  Alert,
} from 'react-native';
import apiClient from '../services/apiClient';
import Ionicons from 'react-native-vector-icons/Ionicons'
import GroupForm from '../components/GroupForm';
import {UserContext} from '../userContext'

  const UpdateGroup = ({ route, navigation }) => {
    const group_pk = route.params.group_pk;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [modalWidth, setModalWidth] = useState(0);
    const [initialData, setInitialData] = useState(null)
    const currentUser = useContext(UserContext);
    const [currentMember, setCurrentMember] = useState(null);

    useEffect(() => {
      apiClient.get(`/api/groups/${group_pk}/`)
      .then(response => {
        setInitialData(response.data)
      })
      .catch(error => {
          console.error('데이터를 불러오는데 실패했습니다', error);
      });
    }, []);

    useEffect(()=> {
      if(initialData) {
        if(initialData.members) {
          const member = initialData.members.find(member => member.username === currentUser.username);
          setCurrentMember(member);
        }
      }
    }, [initialData]);

    useEffect(()=> {
    }, [currentMember]);

    const handleDeleteGroup = async () => {
      try {
        await apiClient.delete(`/api/groups/${group_pk}/`);
        navigation.navigate('Main', {
          deletedGroupId: group_pk,
        }); // 삭제 후 메인 화면으로 돌아가기
      } catch (error) {
        Alert.alert('그룹 삭제에 실패했습니다: ' + error.response.data.error);
      }
      setIsDeleteModalOpen(false);
    };

    if((initialData === null) || (currentMember === null)) {
      return <View></View>
    }


    return (
      <SafeAreaView style={styles.Container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={30} color="#616161" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>모임 정보</Text>
          </View>
          {currentMember && currentMember.grade.group ? (
          <TouchableOpacity onPress={() => setIsDeleteModalOpen(true)}
            onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setModalWidth(width);
            }}>
            <Text style={styles.deleteText}>삭제</Text>
          </TouchableOpacity>
          ) : (
            <TouchableOpacity></TouchableOpacity>
          )}
        </View>

        <GroupForm group_pk={group_pk} screenName={'UpdateGroup'} initialData={initialData} currentMember={currentMember} navigation={navigation}/>
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
              <View style={[styles.updateModal]}>
                <Text style={styles.updateModalTitle}>모임을 삭제하시겠습니까?</Text>
                <View style={styles.updateModalButton}>
                  <TouchableOpacity
                    onPress={() => setIsDeleteModalOpen(false)}
                    style={styles.updateModalButtonNo}>
                    <Text style={styles.updateModalButtonNoText}>아니오</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDeleteGroup}
                    style={styles.deleteModalButtonYes}>
                    <Text style={styles.updateModalButtonYesText}>네</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>)}
      </SafeAreaView>
    );
  };

  const styles = StyleSheet.create({
    Container: {
      flex: 1,
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
      maxWidth:400,
      borderWidth: 1,
      borderColor: '#cccccc',
      backgroundColor: '#ffffff',
      borderRadius: 15,
      paddingTop: 40,
      paddingBottom: 30,
      alignItems: 'center',
    },
    updateModalTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 30,
      color: '#434343',
    },
    updateModalButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    updateModalButtonNo: {
      width: '40%',
      alignItems: 'center',
      padding: 10,
    },
    updateModalButtonNoText: {
      color: '#5DAF6A',
      fontSize: 18,
      fontWeight: '700',
    },
    deleteModalButtonYes: {
      width: '40%',
      alignItems: 'center',
      backgroundColor: '#FF5A5A',
      borderRadius: 10,
      paddingTop: 13,
      paddingBottom: 13,
    },
    updateModalButtonYesText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#ffffff',
    },
  });

  export default UpdateGroup;
