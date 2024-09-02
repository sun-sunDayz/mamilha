import React, { useState, useRef } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TextInput, StatusBar, TouchableWithoutFeedback, Keyboard, TouchableOpacity, SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GroupCategory from '../components/GroupCategory';
import GroupMember from '../components/GroupMember';
import Currency from '../components/Currency';
import Icon from 'react-native-vector-icons/Ionicons'
import apiClient from '../services/apiClient';



const CreateGroup = () => {
    const [groupName, setGroupName] = useState('');
    const [groupCategory, setGroupCategory] = useState('');
    const [currency, setCurrency] = useState('');
    const [members, setMembers] = useState([]);
    const navigation = useNavigation();
    const scrollViewRef = useRef(null);

    const handleCreateGroup = async () => {
        try {
            await apiClient.post('/api/groups/', {
                name: groupName,
                category: groupCategory,
                currency: currency,
                members: members,
            });
            setGroupName('');
            setGroupCategory('');
            setCurrency('');
            setMembers([]);
            navigation.navigate('Main');
        } catch (error) {
            alert(error.response.data.error);
        }
    };

    const handleHome = () => {
        navigation.navigate('Main');
        setGroupName('');
        setGroupCategory('');
        setCurrency('');
        setMembers([]);
    };

    const handleAddMember = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView SafeAreaView style={styles.Container}>
                <StatusBar backgroundColor='white' barStyle='dark-content' />
                <View style={styles.TopContainer}>
                    <View style={styles.TitleContainer}>
                        <Text style={styles.TitleText}>모임생성</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={handleHome} style={styles.CloseIcon} >
                    <Icon name="close-outline" size={40} color="#000000" />
                </TouchableOpacity>
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
                        <GroupMember onChangeMembers={setMembers} onAddMember={handleAddMember} />
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
        backgroundColor: "#F1F1F9",
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
    MemberContainer:{
        margin: 10
    },
    MemberTitle:{ 
        fontSize: 15,
        fontWeight: '700' 
    },
    MemberUserContainer:{
        borderRadius: 15,
        backgroundColor: '#ffffff',
        marginTop: 10,
        padding: 10,
        paddingLeft: 15,
        flexDirection: 'row'
    },
    MemberUserName:{ 
        fontSize: 18,
        color: '#000000' 
    },
    MemberUserMe:{
        fontSize: 18,
        fontWeight: '700',
        color: '#5DAF6A',
        marginTop: -2,
        marginLeft: 5
    },
});

export default CreateGroup;
