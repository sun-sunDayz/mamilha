import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TextInput, StatusBar, TouchableWithoutFeedback, Keyboard, TouchableOpacity, SafeAreaView, Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GroupCategory from '../components/GroupCategory';
import GroupMember from '../components/GroupMember';
import UpdateMember from '../components/UpdateMember';
import Currency from '../components/Currency';
import Ionicons from 'react-native-vector-icons/Ionicons'
import apiClient from '../services/apiClient';


const UpdateGroup = ({route}) => {
    const [groupName, setGroupName] = useState('');
    const [groupCategory, setGroupCategory] = useState('');
    const [currency, setCurrency] = useState('');
    const [members, setMembers] = useState();
    const [updateMembers, setUpdateMembers] = useState([]);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [modalWidth, setModalWidth] = useState(0)
    const navigation = useNavigation();
    const scrollViewRef = useRef(null);
    
    const group_pk = route.params.group_pk

    useEffect(() => {
        apiClient.get(`/api/groups/${group_pk}/`)
            .then(response => {
                setCurrency(response.data.currency)
                setGroupCategory(response.data.category)
                setGroupName(response.data.name)
                setUpdateMembers(response.data.member)
                setMembers([]);
            })
            .catch(error => {
                console.error('데이터를 불러오는데 실패했습니다', error);
            });
    }, []);

    const handleUpdateGroup = async () => {
        try {
            await apiClient.put(`/api/groups/${group_pk}/`, {
                name: groupName,
                category: groupCategory,
                currency: currency,
                new_members: members,
                update_members: updateMembers,
            });
            setMembers([]);
            setUpdateMembers([]);
            navigation.goBack(); //모임 화면으로 이동하게
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
        setUpdateMembers(updateMembers)
        navigation.goBack();
    };

    const handleAddMember = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.Container}>
                <View style={styles.header}>
                    <Ionicons name="close" size={30} color="#616161" />
                        <View>
                            <Text style={styles.title}>모임 정보</Text>
                        </View>
                    <Ionicons name="settings-outline" size={30} color="transparent" />
                </View>
                <ScrollView ref={scrollViewRef} contentContainerStyle={styles.ScrollViewContent}>
                    <View style={styles.SectionContainer}>
                        <Text style={styles.SectionTitle}>모임 이름</Text>
                        <TextInput
                            placeholder="모임 이름 입력"
                            keyboardType="default"
                            style={styles.GroupNameInput}
                            value={groupName}
                            onChangeText={setGroupName}
                        />
                    </View>
                    <View style={styles.SectionContainer}>
                        <Text style={styles.SectionTitle}>모임 카테고리</Text>
                        <GroupCategory selectedCategory={groupCategory} onChangeCategory={setGroupCategory} />
                    </View>
                    <View style={styles.SectionContainer}>
                        <Text style={styles.SectionTitle}>통화 카테고리</Text>
                        <Currency selectedCurrency={currency} onChangeCurrency={setCurrency} />
                    </View>
                    <View style={styles.MemberContainer}>
                        <Text style={styles.MemberTitle}>멤버</Text>
                        <View style={styles.MemberUserContainer}>
                            <Text style={styles.MemberUserName}>닉네임</Text>
                            <Text style={styles.MemberUserMe}>(나)</Text>
                        </View>
                        <UpdateMember
                            onUpdateMembers={setUpdateMembers}
                            selectedMembers={updateMembers}
                        />
                        <GroupMember onChangeMembers={setMembers}
                            onAddMember={handleAddMember}
                            />
                    </View>
                </ScrollView>

                <TouchableOpacity onPress={() => setIsUpdateModalOpen(true)}
                    style={styles.UpdateGroupButton}
                    onLayout={(event) => {
                        const { width } = event.nativeEvent.layout;
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
                            onPressOut={() => setIsUpdateModalOpen(false)}
                        >
                            <View style={[styles.updateModal, { width: modalWidth }]}>
                                <Text style={styles.udateModalTitel}>모임 정보를 수정하시겠습니까?</Text>
                                <View style={styles.udateModalButton}>
                                    <TouchableOpacity
                                        onPress={() => setIsUpdateModalOpen(false)}
                                        style={styles.udateModalButtonNo} >
                                        <Text style={styles.udateModalButtonNoText}>아니오</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleUpdateGroup}
                                        style={styles.udateModalButtonYes}>
                                        <Text style={styles.udateModalButtonYesText} >네</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Modal>)}
            </SafeAreaView>
        </TouchableWithoutFeedback>
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
    GroupNameInput: {
        height: 40,
        fontSize: 18,
        color: '#000000',
        marginTop: 10,
        padding: 10,
        paddingLeft: 15,
        backgroundColor: '#ffffff',
        borderRadius: 15,
    },
    ScrollViewContent: {
        padding: 10,
        paddingBottom: 150,
    },
    SectionContainer: {
        margin: 10
    },
    SectionTitle: {
        fontSize: 15,
        fontWeight: '700',
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
        color: '#434343'
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
    udateModalButtonYesText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff'
    },
    MemberContainer: {
        margin: 10
    },
    MemberTitle: {
        fontSize: 15,
        fontWeight: '700'
    },
    MemberUserContainer: {
        borderRadius: 15,
        backgroundColor: '#ffffff',
        marginTop: 10,
        padding: 10,
        paddingLeft: 15,
        flexDirection: 'row'
    },
    MemberUserName: {
        fontSize: 18,
        color: '#000000'
    },
    MemberUserMe: {
        fontSize: 18,
        fontWeight: '600',
        color: '#5DAF6A',
        marginTop: -2,
        marginLeft: 5
    },
});

export default UpdateGroup;
