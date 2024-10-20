import React, { useState, useRef } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TextInput, StatusBar, TouchableWithoutFeedback, Keyboard, TouchableOpacity, SafeAreaView
} from 'react-native';
import GroupCategory from '../components/GroupCategory';
import GroupMember from '../components/GroupMember';
import Currency from '../components/Currency';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiClient from '../services/apiClient';
import GroupForm from '../components/GroupForm';



const CreateGroup = ({ navigation }) => {

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

                <GroupForm screenName={'CreateGroup'}/>

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
});

export default CreateGroup;
