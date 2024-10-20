import React, { useState, useRef } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TextInput, StatusBar, TouchableWithoutFeedback, Keyboard, TouchableOpacity, SafeAreaView
} from 'react-native';
import GroupCategory from '../components/GroupCategory';
import Currency from '../components/Currency';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiClient from '../services/apiClient';
import {useNavigation} from '@react-navigation/native';

const GroupForm = ({ group_pk, initialData = {}, screenName }) => {
    const scrollViewRef = useRef(null);
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        currency: '',
        nickName: '',
        members: [{ id: 1, name: '', active: 1 }],
        new_members: '',
        update_members: '',
        ...initialData,
    });

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    // 멤버 추가, 삭제 부분
    const addInput = () => {
        const newId = formData.members.length > 0 ? formData.members[formData.members.length - 1].id + 1 : 1;
        handleChange('members', [...formData.members, { id: newId, name: '', active: 1 }])
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    const deleteInput = (id) => {
        if (formData.members.length > 1) {
            handleChange('members', formData.members.filter(member => member.id !== id))

        } else if (formData.members.length == 1) {
            handleChange('members', [{ id: 1, name: '', active: 1 }])
        }
    };

    const handleSubmit = async () => {
        try {
            if (screenName === 'CreateGroup') {
                // Create인 경우 POST 요청
                await apiClient.post('/api/groups/', {
                    ...formData,
                });
            } else if (screenName === 'UpdateGroup') {
                // Update인 경우 PUT 요청
                await apiClient.put(`/api/groups/${group_pk}/`, {
                    ...formData,
                });
            }
            navigation.goBack();
        } catch (error) {
            alert(error.response?.data?.error || "요청 실패");
        }
    };

    return (
        <View>
            <View style={styles.content}>
                <ScrollView ref={scrollViewRef} contentContainerStyle={styles.ScrollViewContent}>
                    <View style={styles.SectionContainer}>
                        <Text style={styles.SectionTitle}>모임 이름</Text>
                        <TextInput
                            placeholder="모임 이름 입력"
                            keyboardType="default"
                            placeholderTextColor="#ADAFBD"
                            style={styles.GroupNameInput}
                            value={formData.name}
                            onChangeText={text => handleChange('name', text)}
                        />
                    </View>
                    <View style={styles.SectionContainer}>
                        <Text style={styles.SectionTitle}>모임 카테고리</Text>
                        <GroupCategory selectedCategory={formData.category} onChangeCategory={text => handleChange('category', text)} />
                    </View>
                    <View style={styles.SectionContainer}>
                        <Text style={styles.SectionTitle}>통화 카테고리</Text>
                        <Currency selectedCurrency={formData.currency} onChangeCurrency={text => handleChange('currency', text)} />
                    </View>
                    <View style={styles.SectionContainer}>
                        <Text style={styles.SectionTitle}>멤버</Text>
                        <View style={styles.MemberUserContainer}>
                            <TextInput
                                style={styles.MemberUserName}
                                placeholder="내 별명 입력"
                                placeholderTextColor="#ADAFBD"
                                keyboardType="default"
                                value={formData.nickName}
                                onChangeText={text => handleChange('nickName', text)}
                            />
                            <Text style={styles.MemberUserMe}>(나)</Text>
                        </View>
                        <View>
                            <View>
                                {formData.members.map((input, index) => (
                                    <View key={input.id} >
                                        <TextInput
                                            style={styles.input}
                                            placeholder="멤버 별명 입력"
                                            placeholderTextColor="#ADAFBD"
                                            keyboardType="default"
                                            value={input['name']}
                                            onChangeText={(text) => {
                                                const newInputs = formData.members.map(item =>
                                                    item.id === input.id ? { ...item, name: text } : item);
                                                handleChange('members', newInputs)
                                            }}
                                        />
                                        <TouchableOpacity onPress={() => deleteInput(input.id)} style={styles.deleteButton}>
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
            <TouchableOpacity onPress={handleSubmit} style={styles.CreateGroupButton} >
                <Text style={styles.CreateGroupButtonText}>생성하기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingBottom: 100,
    },
    GroupNameInput: {
        height: 40,
        fontSize: 16,
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
        marginBottom: 10,
        marginHorizontal: 10
    },
    SectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#000000',
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
        fontSize: 16,
        color: '#000000'
    },
    MemberUserMe: {
        fontSize: 16,
        fontWeight: '700',
        color: '#5DAF6A',
        marginLeft: 5
    },
    input: {
        height: 40,
        fontSize: 16,
        marginTop: 10,
        padding: 10,
        paddingLeft: 15,
        backgroundColor: '#ffffff',
        borderRadius: 15,
    },
    addButton: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    deleteButton: {
        position: 'absolute',
        right: 12,
        top: 18,
        height: 25,
        width: 25,
        borderRadius: 15,
        backgroundColor: '#FFCDCD',
        justifyContent: 'center',
        alignItems: 'center'
    },
    CreateGroupButton: {
        position: 'absolute',
        alignSelf: 'center',
        width: '80%',
        bottom: 100,
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
});


export default GroupForm;
