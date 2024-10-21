import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet,  TouchableOpacity, SafeAreaView, Modal
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons'
import GroupForm from '../components/GroupForm';



const UpdateGroup = ({ route, navigation }) => {
    const group_pk = route.params.group_pk
    const initialData = route.params.initialData

    return (
            <SafeAreaView style={styles.Container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="close" size={30} color="#616161" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.title}>모임 정보</Text>
                    </View>
                    <Ionicons name="settings-outline" size={30} color="transparent" />
                </View>
                
                <GroupForm group_pk={group_pk} screenName={'UpdateGroup'} initialData={initialData}/>
            </SafeAreaView>
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
});

export default UpdateGroup;
