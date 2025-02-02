import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Modal,
    Alert,
} from 'react-native';
import GroupCategory from '../components/GroupCategory';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiClient from '../services/apiClient';
import { useFocusEffect } from '@react-navigation/native';
import {useMemberContext} from '../memberContext'
import { SafeAreaView } from 'react-native-safe-area-context';

const GroupForm = ({ group_pk, initialData = {}, screenName, userName, currentMember=null, navigation}) => {
    const scrollViewRef = useRef(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [modalWidth, setModalWidth] = useState(0);
    const [actives, setActives] = useState(initialData.members);
    const [nickName, setNickName] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        members: [],
        new_members: [],
        update_members: actives,
        ...initialData, // 기존데이터 존제시 자동 추가
    });
    const [inviteCode, setInviteCode] = useState(initialData.invite_code);
    const [inviteCodeErrorMessage, setInviteCodeErrorMessage] = useState('');
    const {memberData: newMemberData, clearMemberData} = useMemberContext();
    // 멤버 추가, 삭제 부분
    const member = screenName === 'CreateGroup' ? 'members' : 'new_members';

    useEffect(() => {
        // console.log(formData.update_members)
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (newMemberData) {
                const data = {
                    id: newMemberData.id,
                    name: newMemberData.nickname,
                    active: newMemberData.isActive,
                    grade: newMemberData.grade
                }

                if(data.id) {
                    const newInputs = formData.update_members.map(item =>
                        item.id === data['id'] ? { ...item, 
                            name: data.name,
                            active: data.active,
                            grade: data.grade,
                        } : item);
                    console.log('new ',newInputs)
                    handleChange('update_members', newInputs);
                } else {
                    const newId = formData[member].length > 0 ? formData[member][formData[member].length - 1].id + 1 : 1;
                    handleChange(member, [...formData[member], { ...data, id: newId }]);
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }

                //멤버 생성 후 초기화
                clearMemberData()
            }
        }, [newMemberData])
    );

    const isEditable = () => {
        if(screenName === 'CreateGroup') {
            return true;
        } else if(screenName === 'UpdateGroup') {
            return currentMember && currentMember.grade.group;
        } else{
            //Assert fail
            return false
        }
    }

    const getMemberGradeText = (member) => {
        return member.grade.name;
    }

    const handleChange = (name, value) => {
        if (name == 'name' && value.length >= 15) {
            Alert.alert("그룹 이름은 15자를 초과할 수 없습니다.")
        }
        setFormData({ ...formData, [name]: value });
    };


    const addInput = () => {
        navigation.navigate('CreateGroupMember')
    };

    const deleteInput = id => {
        handleChange(member, formData[member].filter(member => member.id !== id))
    };
    
    // form 데이터 검사
    const validateFormData = () =>{
        if (!formData.name.trim()){
            Alert.alert("그룹 이름이 없습니다")
            return false
        }
        if (!formData.category){
            Alert.alert("그룹 카테고리를 선택해 주세요")
            return false
        }
        const newMembers = [{ id: 0, name: nickName || userName, active: 1 }, ...formData.members];
        if (newMembers.length === 1){
            Alert.alert("멤버는 한명 이상 있어야 합니다")
            return false
        } 
        return true
    }

    // 데이터 저장
    const handleSubmit = async () => {
        if (validateFormData()) {
            try {
                if (screenName === 'CreateGroup') {
                    // Create인 경우 POST 요청
                    const newMembers = [{ id: 0, name: nickName || userName, active: 1 }, ...formData.members];
                    console.log('members ', newMembers)
    
                    await apiClient.post('/api/groups/', {
                        ...formData,
                        // nickName빈 값일 경울 로그인 유저 닉네임 추가
                        members: newMembers,
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
                Alert.alert(error.response?.data?.error || "요청 실패");
                setIsUpdateModalOpen(false);
            }
        } else {
            return
        }
    };

    const generateInviteCode = async () => {
        try {
            const response = await apiClient.post(`/api/groups/invite/generate/${group_pk}/`);
            const result = response.data
            if(result.success === true) {
                const newCode = result.invite_code
                setInviteCode(newCode);
                setInviteCodeErrorMessage('')
            } else {
                setInviteCodeErrorMessage(result.message)
            }
        } catch (error) {
            Alert.alert('초대코드 생성에 실패했습니다: ' + error.response.data.error);
        }
    };

    const isMemberConnected = member => {
        return member.username !== null;
    };

    const getButtonColor = () => {
        return "FFDDAA";
    }

    return (
        <View>
            <View style={styles.content} 
            pointerEvents={isEditable() ? "auto" : "none"}
            >
                <ScrollView style={styles.scrollContainer}>
                <View style={styles.formRow}>
                    <Text style={styles.label}>모임 이름</Text>
                    <TextInput
                        placeholder="모임 이름 입력"
                        keyboardType="default"
                        placeholderTextColor="#ADAFBD"
                        style={styles.GroupNameInput}
                        value={formData.name}
                        maxLength={15}
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
                            {inviteCodeErrorMessage ? <Text style={styles.errorText}>{inviteCodeErrorMessage}</Text> : null}
                        </View>
                    </View>
                }
                <View style={styles.formRow}>
                    <Text style={styles.label}>멤버</Text>
                    {screenName === 'UpdateGroup' &&
                        <View>
                            {formData.update_members.map((member, index) => (
                                <TouchableOpacity key={member['id']} style={styles.MemberUserContainer} 
                                disabled={member.grade.group}   //관리자인 경우 편집 불가
                                onPress={() => {
                                    navigation.navigate('UpdateGroupMember', 
                                        {
                                            id: member.id,
                                            username: member.username, 
                                            nickname: member.name, 
                                            grade: member.grade, 
                                            isActive: member.active
                                        })
                                }}>
                                    <TextInput
                                        style={styles.MemberUserName}
                                        placeholder="멤버 별명 입력"
                                        placeholderTextColor="#ADAFBD"
                                        keyboardType="default"
                                        value={member['name']}
                                        disabled={true}
                                        onChangeText={text => {
                                            const newInputs = formData.update_members.map(item =>
                                                item.id === member['id'] ? { ...item, name: text } : item);
                                            handleChange('update_members', newInputs);
                                        }}
                                    />
                                    {member['id'] === currentMember.id && (
                                        <Text style={styles.MemberUserMe}>(나)</Text>
                                    )}
                                    <View style={styles.memberRightContainer}>
                                        {isMemberConnected(member) && 
                                            <View 
                                                style={[styles.accountLabel, {backgroundColor:`#${member.grade.color}33`, borderColor:`#${member.grade.color}`} ]}>
                                                <Text style={[styles.accountLabelText, {color:`#${member.grade.color}`}]}>
                                                    {getMemberGradeText(member)}
                                                </Text>
                                            </View>
                                        }
                                        <View
                                            style={member.active ? styles.activeButton : styles.inActiveButton}
                                        >
                                            <Text style={member.active ? styles.activeText : styles.inActiveText}>
                                                {member.active ? '활성' : '비활성'}
                                            </Text>
                                        </View>
                                    </View>

                                </TouchableOpacity>
                            ))}
                        </View>}
                    {screenName === 'CreateGroup' &&
                        <View style={styles.MemberUserContainer}>
                            <TextInput
                                style={styles.MemberUserName}
                                placeholder={userName}
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
                        {
                        isEditable() &&
                        <View style={{ alignItems: 'center', marginTop: 10 }}>
                            <TouchableOpacity onPress={addInput} style={styles.addButton}>
                                <Ionicons name="add-circle" size={35} color='#5DAF6A' />
                            </TouchableOpacity>
                        </View>
                        }
                    </View>
                </View>
                </ScrollView>
                {screenName == 'CreateGroup' ?
                    <TouchableOpacity onPress={handleSubmit} style={styles.CreateGroupButton} >
                        <Text style={styles.CreateGroupButtonText}>생성하기</Text>
                    </TouchableOpacity>
                    : (isEditable() && (
                    <TouchableOpacity onPress={() => setIsUpdateModalOpen(true)}
                        style={styles.CreateGroupButton}
                        onLayout={(event) => {
                            const { width } = event.nativeEvent.layout;
                            setModalWidth(width);
                        }}>
                        <Text style={styles.CreateGroupButtonText}>수정하기</Text>
                    </TouchableOpacity>))
                }
            </View>

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
                        <View style={[styles.updateModal, { width: modalWidth }]}>
                            <Text style={styles.updateModalTitle}>모임 정보를 수정하시겠습니까?</Text>
                            <View style={styles.updateModalButton}>
                                <TouchableOpacity
                                    onPress={() => setIsUpdateModalOpen(false)}
                                    style={styles.updateModalButtonNo} >
                                    <Text style={styles.updateModalButtonNoText}>아니오</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    style={styles.updateModalButtonYes}>
                                    <Text style={styles.updateModalButtonYesText} >네</Text>
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
        height: '100%',
        paddingHorizontal: 20,
    },
    scrollContainer: {
        flex: 1,
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
        backgroundColor: '#FFFFFF',
        width: '95%',
        paddingLeft: 10,
        marginLeft: 8,
        marginTop: 8,
        borderRadius: 8,
        flexDirection: 'row', 
        alignItems: 'center',
    },
    MemberUserName: {
        fontSize: 16,
        color: '#434343',
    },
    MemberUserMe: {
        fontSize: 16,
        fontWeight: '700',
        color: '#5DAF6A',
        paddingBottom: 5 ,
    },
    input: {
        backgroundColor: '#ffffff',
        width: '95%',
        paddingLeft: 10,
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
        width: '100%',
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
        backgroundColor: '#5DAF6A',
        borderRadius: 10,
    },
    CreateGroupButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    memberRightContainer: {
        flexDirection: 'row',
        marginLeft: 'auto',
        paddingRight: 10,
    },
    // 활성화버튼
    activeButton: {
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
    accountLabel: {
        marginRight: 10,
        height: 25,
        width: 60,
        borderRadius: 5,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#79C7E8',
        backgroundColor: 'rgba(121,199,232,0.2)',
    },
    accountLabelText: {
        fontSize: 14,
    },
    adminAccountBackground: {
        backgroundColor: 'rgba(232, 121, 121, 0.2)',
        borderColor: 'rgba(232, 121, 121, 1.0)',
    },
    adminAccountText: {
        color: 'rgba(232, 121, 121, 1.0)',
    },

    editAccountBackground: {
        backgroundColor: 'rgba(232, 174, 121, 0.2)',
        borderColor: 'rgba(232, 174, 121, 1.0)',
    },
    editAccountText: {
        color: 'rgba(232, 174, 121, 1.0)',
    },

    viewAccountBackground: {
        backgroundColor: 'rgba(121,199,232,0.2)',
        borderColor: 'rgba(121,199,232,1.0)',
    },
    viewAccountText: {
        color: 'rgba(121,199,232,1.0)',
    },
    //모달창
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
    updateModalButtonYes: {
        width: '40%',
        alignItems: 'center',
        backgroundColor: '#5DAF6A',
        borderRadius: 10,
        paddingTop: 13,
        paddingBottom: 13,
    },
    updateModalButtonYesText: {
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
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 8,
    },
    gradeText: {
        backgroundColor: '#EEEEEE',
        color: 'red',
        fontSize: 10,
    },
});


export default GroupForm;
