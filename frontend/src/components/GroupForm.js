import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Modal
} from 'react-native';
import GroupCategory from '../components/GroupCategory';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiClient from '../services/apiClient';
import { useNavigation } from '@react-navigation/native';

const GroupForm = ({ group_pk, initialData = {}, screenName }) => {
    const scrollViewRef = useRef(null);
    const navigation = useNavigation();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [modalWidth, setModalWidth] = useState(0);
    const [actives, setActives] = useState(initialData.members);
    const [nickName, setNickName] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        members: [{ id: 1, name: '', active: 1 }],
        new_members: [{ id: 1, name: '', active: 1 }],
        update_members: actives,
        ...initialData, // 기존데이터 존제시 자동 추가
    });
    const [inviteCode, setInviteCode] = useState(initialData.invite_code);

    const updateInviteCode = async () => {
        try {
            const response = await apiClient.get(`/api/groups/invite/${group_pk}/`);
            const newCode = response.data.invite_code
            setInviteCode(newCode);
            } catch (error) {
            alert('초대코드 생성에 실패했습니다: ' + error.response.data.error);
        }
    }

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    // 멤버 추가, 삭제 부분
    const member = screenName === 'CreateGroup' ? 'members' : 'new_members';

    const addInput = () => {
        const newId = formData[member].length > 0 ? formData[member][formData[member].length - 1].id + 1 : 1;
        handleChange(member, [...formData[member], { id: newId, name: '', active: 1 }])
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    const deleteInput = id => {
        if (formData[member].length > 1) {
            handleChange(member, formData[member].filter(member => member.id !== id))
        } else if (formData[member].length == 1) {
            handleChange(member, [{ id: 1, name: '', active: 1 }])
        }
    };

    // 데이터 저장
    const handleSubmit = async () => {
        try {
            if (screenName === 'CreateGroup') {
                // Create인 경우 POST 요청
                await apiClient.post('/api/groups/', {
                    ...formData,
                    members: [{ id: 0, name: nickName, active: 1 }, ...formData.members ]
                });
            } else if (screenName === 'UpdateGroup') {
                // Update인 경우 PUT 요청
                await apiClient.put(`/api/groups/${group_pk}/`, {
                    ...formData,
                });
                setIsUpdateModalOpen(false);
            }
            navigation.goBack();
        } catch (error) {
            alert(error.response?.data?.error || "요청 실패");
            setIsUpdateModalOpen(false);
        }
    };

    const generateInviteCode = async () => {
        try {
            const response = await apiClient.post(`/api/groups/invite/generate/${group_pk}/`);
            const newCode = response.data.invite_code
            setInviteCode(newCode);
            } catch (error) {
            alert('초대코드 생성에 실패했습니다: ' + error.response.data.error);
            }
    };


    return (
        <View >
            <View style={styles.content}>
                <ScrollView ref={scrollViewRef} contentContainerStyle={styles.ScrollViewContent}>
                    <View style={styles.formRow}>
                        <Text style={styles.label}>모임 이름</Text>
                        <TextInput
                            placeholder="모임 이름 입력"
                            keyboardType="default"
                            placeholderTextColor="#ADAFBD"
                            style={styles.GroupNameInput}
                            value={formData.name}
                            onChangeText={text => handleChange('name', text)}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.label}>모임 카테고리</Text>
                        <GroupCategory selectedCategory={formData.category} onChangeCategory={text => handleChange('category', text)} />
                    </View>

                    {screenName === 'UpdateGroup' &&
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
                    }
                    <View style={styles.formRow}>
                        <Text style={styles.label}>멤버</Text>
                        {screenName === 'UpdateGroup' &&
                            <View>
                                {formData.update_members.map((active, index) => (
                                    <View key={active['id']} style={styles.MemberUserContainer}>
                                        <TextInput
                                            style={styles.MemberUserName}
                                            placeholder="멤버 별명 입력"
                                            placeholderTextColor="#ADAFBD"
                                            keyboardType="default"
                                            value={active['name']}
                                            onChangeText={text => {
                                                const newInputs = formData.update_members.map(item =>
                                                    item.id === active['id'] ? { ...item, name: text } : item);
                                                handleChange('update_members', newInputs);
                                            }}
                                        />
                                        {active['id'] === 0 && (
                                            <Text style={styles.MemberUserMe}>(나)</Text>
                                        )}
                                        <TouchableOpacity
                                            onPress={() => {
                                                const newInputs = formData.update_members.map(item =>
                                                    item.id === active.id ? { ...item, active: item.active ? 0 : 1 } : item
                                                );
                                                handleChange('update_members', newInputs);
                                            }}
                                            style={active.active ? styles.activeButton : styles.inActiveButton}
                                        >
                                            <Text style={active.active ? styles.activeText : styles.inActiveText}>
                                                {active.active ? '활성' : '비활성'}
                                            </Text>
                                        </TouchableOpacity>

                                    </View>
                                ))}
                            </View>}
                        {screenName === 'CreateGroup' &&
                            <View style={styles.MemberUserContainer}>
                                <TextInput
                                    style={styles.MemberUserName}
                                    placeholder="내 별명 입력"
                                    placeholderTextColor="#ADAFBD"
                                    keyboardType="default"
                                    value={nickName}
                                    onChangeText={setNickName}
                                />
                                <Text style={styles.MemberUserMe}>(나)</Text>
                            </View>
                        }
                        <View>
                            <View>
                                {formData[member].map((input, index) => (
                                    <View key={input.id} >
                                        <TextInput
                                            style={styles.input}
                                            placeholder="멤버 별명 입력"
                                            placeholderTextColor="#ADAFBD"
                                            keyboardType="default"
                                            value={input['name']}
                                            onChangeText={(text) => {
                                                const newInputs = formData[member].map(item =>
                                                    item.id === input.id ? { ...item, name: text } : item
                                                );
                                                handleChange(member, newInputs);
                                            }}
                                        />
                                        <TouchableOpacity
                                            onPress={() => deleteInput(input.id)}
                                            style={styles.deleteButton}>
                                            <Ionicons name="trash-outline" size={18} color='#C65757' />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                            <View style={{ alignItems: 'center', marginTop: 10 }}>
                                <TouchableOpacity onPress={addInput} style={styles.addButton}>
                                    <Ionicons name="add-circle" size={35} color='#5DAF6A' />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
            {screenName == 'CreateGroup' ?
                <TouchableOpacity onPress={handleSubmit} style={styles.CreateGroupButton} >
                    <Text style={styles.CreateGroupButtonText}>생성하기</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => setIsUpdateModalOpen(true)}
                    style={styles.CreateGroupButton}
                    onLayout={(event) => {
                        const { width } = event.nativeEvent.layout;
                        setModalWidth(width);
                    }}>
                    <Text style={styles.CreateGroupButtonText}>수정하기</Text>
                </TouchableOpacity>}

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
                                    onPress={handleSubmit}
                                    style={styles.udateModalButtonYes}>
                                    <Text style={styles.udateModalButtonYesText} >네</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>)}
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
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
    MemberUserContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        width: '95%',
        padding: 10,
        marginLeft: 8,
        marginTop: 8,
        borderRadius: 8,
    },
    MemberUserName: {
        // flex: 1,
        fontSize: 16,
        color: '#434343',
    },
    MemberUserMe: {
        fontSize: 16,
        fontWeight: '700',
        color: '#5DAF6A',
        marginLeft: 5,
        // position: 'absolute',
    },
    input: {
        backgroundColor: '#ffffff',
        width: '95%',
        padding: 10,
        marginLeft: 8,
        borderRadius: 8,
        marginTop: 8,
        fontSize: 16,
        color: '#434343',
    },
    addButton: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        position: 'absolute',
        right: 20,
        top: 16,
        height: 25,
        width: 25,
        borderRadius: 15,
        backgroundColor: '#FFCDCD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    CreateGroupButton: {
        position: 'absolute',
        alignSelf: 'center',
        width: '80%',
        top: 500,
        padding: 13,
        backgroundColor: '#5DAF6A',
        borderRadius: 10,
        alignItems: 'center',
    },
    CreateGroupButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    // 활성화버튼
    activeButton: {
        position: 'absolute',
        right: 12,
        top: 8,
        height: 25,
        width: 60,
        borderRadius: 5,
        borderColor: '#5DAF6A',
        borderWidth: 1,
        backgroundColor: 'rgba(93,175,106,0.2)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    activeText: {
        fontSize: 14,
        color: '#5DAF6A'
    },
    inActiveButton: {
        position: 'absolute',
        right: 12,
        top: 8,
        height: 25,
        width: 60,
        borderRadius: 5,
        borderColor: '#6C6C6C',
        borderWidth: 1,
        backgroundColor: 'rgba(108,108,108,0.2)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inActiveText: {
        fontSize: 14,
        color: '#6C6C6C'
    },
    //모달창
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


export default GroupForm;
