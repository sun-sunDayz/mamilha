import React, { useState, useRef } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TextInput, StatusBar, TouchableWithoutFeedback, Keyboard, TouchableOpacity, SafeAreaView
} from 'react-native';
import GroupCategory from '../components/GroupCategory';
import GroupMember from '../components/GroupMember';
import Currency from '../components/Currency';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiClient from '../services/apiClient';



const CreateGroup = ({ navigation }) => {
    const [groupName, setGroupName] = useState('');
    const [groupCategory, setGroupCategory] = useState('');
    const [currency, setCurrency] = useState('');
    const [members, setMembers] = useState([{ id: 1, name: '', active: 1 }]);
    const scrollViewRef = useRef(null);
    const [nickname, setNickname] = useState('');

    const handleCreateGroup = async () => {
        try {
            await apiClient.post('/api/groups/', {
                name: groupName,
                category: groupCategory,
                currency: currency,
                members: [{ id: 0, name: nickname, active: 1 }, ...members],
            });
            setGroupName('');
            setGroupCategory('');
            setCurrency('');
            setNickname('');
            setMembers([{ id: 1, name: '', active: 1 }]);
            navigation.navigate('Main');
        } catch (error) {
            alert(error.response.data.error);
        }
    };

    const addInput = () => {
        const newId = members.length > 0 ? members[members.length - 1].id + 1 : 1;
        setMembers([...members, { id: newId, name: '', active: 1 }]);
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    const deleteInput = (id) => {
        if (members.length > 1) {
            setMembers(members.filter(member => member.id !== id));
        } else if (members.length == 1) {
            setMembers([{ id: 1, name: '', active: 1 }])
        }
    };


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView SafeAreaView style={styles.Container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="close" size={30} color="#616161" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.title}>모임 생성</Text>
                    </View>
                    <Ionicons name="settings-outline" size={30} color="transparent" />
                </View>
                <ScrollView ref={scrollViewRef} contentContainerStyle={styles.ScrollViewContent}>
                    <View style={styles.SectionContainer}>
                        <Text style={styles.SectionTitle}>모임 이름</Text>
                        <TextInput
                            placeholder="모임 이름 입력"
                            keyboardType="default"
                            placeholderTextColor="#ADAFBD"
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
                    <View style={styles.SectionContainer}>
                        <Text style={styles.SectionTitle}>멤버</Text>
                        <View style={styles.MemberUserContainer}>
                            <TextInput
                                style={styles.MemberUserName}
                                placeholder="내 별명 입력"
                                placeholderTextColor="#ADAFBD"
                                keyboardType="default"
                                value={nickname}
                                onChangeText={setNickname}
                            />
                            <Text style={styles.MemberUserMe}>(나)</Text>
                        </View>
                        <View>
                            <View>
                                {members.map((input, index) => (
                                    <View key={input.id} >
                                        <TextInput
                                            style={styles.input}
                                            placeholder="멤버 별명 입력"
                                            placeholderTextColor="#ADAFBD"
                                            keyboardType="default"
                                            value={input['name']}
                                            onChangeText={(text) => {
                                                const newInputs = members.map(item =>
                                                    item.id === input.id ? { ...item, name: text } : item);
                                                setMembers(newInputs);
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

                <TouchableOpacity onPress={handleCreateGroup} style={styles.CreateGroupButton} >
                    <Text style={styles.CreateGroupButtonText}>생성하기</Text>
                </TouchableOpacity>
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
        top: 10,
    },
    TitleText: {
        fontSize: 25,
        fontWeight: '700',
        textAlign: 'center',
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
    CreateGroupButton: {
        position: 'absolute',
        alignSelf: 'center',
        width: '80%',
        bottom: 50,
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
});

export default CreateGroup;
