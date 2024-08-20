import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, ScrollView, StyleSheet, StatusBar, TouchableWithoutFeedback, Keyboard, TouchableOpacity, SafeAreaView, Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons'


const FinancesDetail = ({ }) => {
    const navigation = useNavigation();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [modalWidth, setModalWidth] = useState(0);

    const handleUpdateGroup = async () => {
        setIsUpdateModalOpen(false);
    };

    const handleHome = () => {
        navigation.navigate('Main');
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView SafeAreaView style={styles.Container}>
                <StatusBar backgroundColor='white' barStyle='dark-content' />
                <View style={styles.TopContainer}>
                    <TouchableOpacity onPress={handleHome} style={styles.CloseIcon} >
                        <Icon name="chevron-back" size={40} color="#6C6C6C" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleHome} style={styles.CloseIcon} >
                        <Text style={styles.DeleteText}>삭제</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.Content}>
                    <View style={styles.ContentTop}>
                        <Text style={styles.ContentTitle}>금액</Text>
                        <View style={styles.ContentTopView}>
                            <Text style={styles.ContentTopNum}>999,999,999</Text>
                            <Text style={styles.ContentTopText}>원</Text>
                        </View>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.ContentMiddle}>
                        <View style={styles.ContentMiddleView}>
                            <Text style={styles.ContentTitle}>일시</Text>
                            <Text style={styles.ContentText}>YYYY.MM.DD (e) hh:mm</Text>
                        </View>
                        <View style={styles.ContentMiddleView}>
                            <Text style={styles.ContentTitle}>구분</Text>
                            <Text style={styles.ContentText}>지출</Text>
                        </View>
                        <View style={styles.ContentMiddleView}>
                            <Text style={styles.ContentTitle}>카테고리</Text>
                            <Text style={styles.ContentText}>카테고리 1</Text>
                        </View>
                        <View style={styles.ContentMiddleView}>
                            <Text style={styles.ContentTitle}>담당 멤버</Text>
                            <Text style={styles.ContentText}>멤버 1</Text>
                        </View>
                        <View style={styles.ContentMiddleView}>
                            <Text style={styles.ContentTitle}>방식</Text>
                            <Text style={styles.ContentText}>카드</Text>
                        </View>
                    </View>
                    <View style={styles.ContentBottom}>
                        <Text style={styles.ContentTitle}>설명</Text>
                        <Text style={styles.ContentBottomText}>설명입니다</Text>
                    </View>
                </ScrollView>
                <TouchableOpacity onPress={() => setIsUpdateModalOpen(true)}
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
        margin: 10,
    },
    TopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom:20,
    },
    CloseIcon: {
        padding: 0
    },
    DeleteText: {
        fontSize: 20,
        fontWeight: '700',
        right: 10,
        color: "#616161",
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginVertical: 10,
    },
    Content: {
        paddingHorizontal: 20,
    },
    ContentTitle: {
        fontSize: 20,
        fontWeight: '700',
        paddingTop: 10,
        paddingBottom: 10
    },
    ContentTop: {
        
    },
    ContentTopView:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    ContentTopNum:{
        fontSize: 32,
        fontWeight: '700',
        color:'#434343'
    },
    ContentTopText:{
        fontSize: 20,
        top: 5,
        paddingLeft:5
    },
    ContentMiddle: {
        flex: 1
    },
    ContentMiddleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ContentText:{
        fontSize: 18,
        fontWeight: '700',
        color:'#434343'
    },  
    ContentBottomText:{
        fontSize: 16,
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
});

export default FinancesDetail;
