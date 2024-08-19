import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TextInput, StatusBar, TouchableWithoutFeedback, Keyboard, TouchableOpacity, SafeAreaView, Modal
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import GroupCategory from '../components/GroupCategory';
import GroupMember from '../components/GroupMember';
import Currency from '../components/Currency';
import Feather from 'react-native-vector-icons/Feather';


const UpdateGroup = ( {group_pk} ) => {
    const [groupName, setGroupName] = useState('');
    const [groupCategory, setGroupCategory] = useState('');
    const [currency, setCurrency] = useState('');
    const [members, setMembers] = useState([]);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [modalWidth, setModalWidth] = useState(0)
    const navigation = useNavigation();
    const scrollViewRef = useRef(null);


    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/groups/${18}`)
            .then(response => {
                setCurrency(response.data.currency)
                setGroupCategory(response.data.category)
                setGroupName(response.data.name)
                setMembers(response.data.member)
            })
            .catch(error => {
                console.error('데이터를 불러오는데 실패했습니다', error);
            });
    }, []);

    const handleUpdateGroup = async () => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/groups/${18}`, {
                name: groupName,
                category: groupCategory,
                currency: currency,
                members: members,
            });
        } catch (error) {
            console.error('Error', error);
        }
        setGroupName(groupName);
        setGroupCategory(groupCategory);
        setCurrency(currency);
        setMembers(members);
        setIsUpdateModalOpen(false)
    };


    const handleHome = () => {
        navigation.navigate('Main');
        setGroupName(groupName);
        setGroupCategory(groupCategory);
        setCurrency(currency);
        setMembers(members);
    };

    const handleAddMember = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };
    console.log(members)
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
                    <Feather name="x" size={40} color="#000000" />
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
                    <GroupMember selectedMembers={members} onChangeMembers={setMembers} onAddMember={handleAddMember} />
                </ScrollView>

                <TouchableOpacity onPress={() => setIsUpdateModalOpen(true)} 
                style={styles.UpdateGroupButton}
                onLayout={(event) => {
                    const { width } = event.nativeEvent.layout;
                    setModalWidth(width);
                }}>
                    <Text style={styles.UpdateGroupButtonText}>생성하기</Text>
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
                            <View style={[styles.updateModal, {width: modalWidth}]}>
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
        fontWeight: '600',
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
    updateModal:{
        borderWidth: 1,
        borderColor: '#cccccc',
        backgroundColor: '#ffffff',
        borderRadius: 15,
        paddingTop: 40,
        paddingBottom: 30,
        alignItems: 'center',
    },
    udateModalTitel:{
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 30
    },
    udateModalButton:{
        flexDirection: 'row',          
        justifyContent: 'space-between', 
        alignItems: 'center',
    },
    udateModalButtonNo:{
        width: '40%',
        alignItems: 'center',
        padding: 10,
    },
    udateModalButtonNoText:{
        color: '#5DAF6A',
        fontSize: 18,
        fontWeight: '700',
    },
    udateModalButtonYes:{
        width: '40%',
        alignItems: 'center',
        backgroundColor: '#5DAF6A',
        borderRadius: 10,
        paddingTop: 13,
        paddingBottom: 13,
    },
    udateModalButtonYesText:{
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff'
    },

});

export default UpdateGroup;
