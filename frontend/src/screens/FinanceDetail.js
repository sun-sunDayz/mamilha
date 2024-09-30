import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, SafeAreaView, Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/Ionicons'
import apiClient from '../services/apiClient';
import CustomText from '../../CustomText';

const FinanceDetail = ({ route }) => {
    const navigation = useNavigation();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [modalWidth, setModalWidth] = useState(0);
    const [amount, setAmount] = useState();
    const [description, setDescription] = useState();
    const [payer, setPayar] = useState();
    const [financeType, setFinancesType] = useState();
    const [financeCategory, setFinancesCategory] = useState();
    const [payMethod, setPayMethod] = useState();
    const [splitMethod, setSplitMethod] = useState();
    const [splitMembers, setSplitMembers] = useState();
    const [date, setDate] = useState();
    const [data, setData] = useState()
    const scrollViewRef = useRef(null);

    const group_pk = route.params.group_pk
    const finance_pk = route.params.finance_pk

    useEffect(() => {
        apiClient.get(`/api/finances/${group_pk}/${finance_pk}/`)  
            .then(response => {
                const data = response.data
                setAmount(data.amount) 
                setDescription(data.description)
                setPayar(data.payer)
                setFinancesType(data.finance_type)
                setFinancesCategory(data.finance_category)
                setPayMethod(data.pay_method)
                setSplitMethod(data.split_method)
                setDate(data.date)
                setData(data)
            })
            .catch(error => {
                console.error('데이터를 불러오는데 실패했습니다', error)
            });
    }, []);

    useEffect(() => {
        apiClient.get(`/api/finances/${finance_pk}/splits/`)
            .then(response => {
                setSplitMembers(response.data)
            })
            .catch(error => {
                console.error('데이터를 불러오는데 실패했습니다', error)
            });
    }, []);


    const handleGoBack = () => {
        navigation.goBack();
    }; // 이전화면으로 이동

    const handleDelete = async () => {
        try {
            await apiClient.delete(`/api/finances/${group_pk}/${finance_pk}/`);
            navigation.goBack();
        } catch (error) {
            alert(error.response.data.error);
        }
    }; //finance 삭제

    const handleUpdate = () => {
        navigation.navigate('UpdateFinance', {'data':data, 'group_pk':group_pk});
    }; // finance update screen으로 이동 

    const comma = (amount) => {
        if (!amount && amount !== 0) return "0";
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }; //가격에 쉼표를 넣어서 가져오기

    return (
        <SafeAreaView style={styles.Container}>
            <StatusBar backgroundColor='white' barStyle='dark-content' />
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack} style={styles.CloseIcon} >
                    <Ionicons name="chevron-back-outline" size={30} color="#616161" />
                </TouchableOpacity>
                <View>
                    <CustomText style={styles.title}></CustomText>
                </View>
                <TouchableOpacity onPress={()=>handleDelete()}> 
                    <Text style={styles.DeleteText}>삭제</Text>
                </TouchableOpacity>
            </View>
            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.Content} >
                <View style={styles.ContentTop}>
                    <Text style={styles.ContentTitle}>금액</Text>
                    <View style={styles.ContentTopView}>
                        <Text style={styles.ContentTopNum}>{comma(amount)}</Text>
                        <Text style={styles.ContentTopText}>원</Text>
                    </View>
                </View>
                <View style={styles.separator} />
                <View style={styles.ContentMiddle}>
                    <View style={styles.ContentMiddleView}>
                        <Text style={styles.ContentTitle}>일시</Text>
                        <Text style={styles.ContentText}>{date}</Text>
                    </View>
                    <View style={styles.ContentMiddleView}>
                        <Text style={styles.ContentTitle}>구분</Text>
                        <Text style={styles.ContentText}>{financeType}</Text>
                    </View>
                    <View style={styles.ContentMiddleView}>
                        <Text style={styles.ContentTitle}>카테고리</Text>
                        <Text style={styles.ContentText}>{financeCategory}</Text>
                    </View>
                    <View style={styles.ContentMiddleView}>
                        <Text style={styles.ContentTitle}>담당 멤버</Text>
                        <Text style={styles.ContentText}>{payer}</Text>
                    </View>
                    <View style={styles.ContentMiddleView}>
                        <Text style={styles.ContentTitle}>방식</Text>
                        <Text style={styles.ContentText}>{payMethod}</Text>
                    </View>
                </View>
                <View style={styles.ContentBottom}>
                    <Text style={styles.ContentTitle}>설명</Text>
                    <Text style={styles.ContentBottomText}>{description}</Text>
                </View>
                <View style={[styles.ContentBottom, { paddingTop: 10 }]}>
                    <Text style={styles.ContentTitle}>멤버</Text>
                    <View style={styles.MembersContant}>
                        {splitMembers && splitMembers.map((member, index) => (
                            <View style={[styles.MembeerView,
                            index > 0 && { borderTopWidth: 0.2, borderTopColor: '#ADAFBD', paddingTop: 7 }]}
                                key={index}>
                                <View style={styles.MembeerViewContant}>
                                    <Icon name="person-circle" size={30} color="#5DAF6A" />
                                    <Text style={styles.MemberText}> {member.member} </Text>
                                    {member.currencyUser && (
                                        <Text style={styles.MemberTextMe}>(Me)</Text>  //로그인 user와 같은 이름이 있는 경우 표시
                                    )} 
                                </View>
                                <View style={styles.MembeerViewContant}>
                                    <Text style={styles.MemberText}>{comma(member.amount)}원</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity onPress={handleUpdate}
                style={styles.UpdateGroupButton}
                onLayout={(event) => {
                    const { width } = event.nativeEvent.layout;
                    setModalWidth(width);
                }}>
                <Text style={styles.UpdateGroupButtonText}>편집하기</Text>
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
                            <Text style={styles.udateModalTitel}>지출 내역을 삭제하시겠습니까?</Text>
                            <View style={styles.udateModalButton}>
                                <TouchableOpacity
                                    onPress={() => setIsUpdateModalOpen(false)}
                                    style={styles.udateModalButtonNo} >
                                    <Text style={styles.udateModalButtonNoText}>아니오</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleDelete}
                                    style={styles.udateModalButtonYes}>
                                    <Text style={styles.udateModalButtonYesText} >네</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>)}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    Container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: '#f1f1f9',
    },
    TopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    CloseIcon: {
        padding: 0
    },
    DeleteText: {
        fontSize: 16,
        right: 10,
        color: "#616161",
    },
    separator: {
        height: 0.5,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginVertical: 10,
    },
    Content: {
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    ContentTitle: {
        fontSize: 16,
        fontWeight: '700',
        color : '#000000',
        paddingTop: 10,
    },
    ContentTop: {

    },
    ContentTopView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ContentTopNum: {
        fontSize: 32,
        fontWeight: '700',
        color: '#434343'
    },
    ContentTopText: {
        fontSize: 20,
        top: 5,
        paddingLeft: 5,
        color : '#000000',
    },
    ContentMiddle: {
        flex: 1
    },
    ContentMiddleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ContentText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000'
    },
    ContentBottomText: {
        marginTop: 5,
        fontSize: 16,
        color: '#434343',
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
        backgroundColor: '#FF5A5A',
        borderRadius: 10,
        paddingTop: 13,
        paddingBottom: 13,
    },
    udateModalButtonYesText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff'
    },
    MembersContant: {
        color: '#000000',
        marginTop: 10,
        padding: 10,
        paddingLeft: 15,
        backgroundColor: '#ffffff',
        borderRadius: 15,
    },
    MembeerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    MembeerViewContant: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    MemberText: {
        alignItems: 'center',
        color: '#434343',
        fontSize: 16,
    },
    MemberTextMe: {
        color: '#5DAF6A',
        fontSize: 16,
        fontWeight: '700',
    },
    MembeerUnderBar: {
        height: 1,
        backgroundColor: '#000000',
    }
});

export default FinanceDetail;
