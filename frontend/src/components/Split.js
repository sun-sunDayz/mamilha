import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiClient from '../services/apiClient';

const truncateText = (text, limit) => {
    if (text.length > limit) {
        return text.substring(0, limit) + '...';
    }
    return text;
};

const truncateAmount = (amount) => {
    if (amount >= 99999999) {
        return '99,999,999...원';
    }
    return amount.toLocaleString() + '원';
};

const Split = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const getSplits = async () => {
            try {
                const response = await apiClient.get('/api/groups/103/splits/');
                const splits = response.data;
                setData(splits);
                console.log(splits)
                setFinalSettlements(finalBalances);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        getSplits();
    }, []);

    return (
        <View style={styles.container}>
            {data.length === 0 ? (
                <View style={styles.emptySpendView}>
                    <Ionicons style={styles.emptyIcon} name="checkmark-done-circle" size={150} color="#79C7E8" />
                    <Text style={styles.emptyText}>정산이 모두 완료되었어요!</Text>
                </View>
            ) : (
                <FlatList
                    data={data}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <View style={styles.memberContainer}>
                                <Ionicons name="person-circle-outline" size={36} color="#E87979" />
                                <Text style={styles.name}>{truncateText(item.member, 3)}</Text>
                            </View>
                            <Image source={require('../../assets/line.png')} style={{ width: 6, height: 6, flex: 3, alignItems: 'center' }} />
                            <Text style={styles.price}>{truncateAmount(item.amount)}</Text>
                            <Image source={require('../../assets/arrow_right.png')} style={{ width: 6, height: 6, resizeMode: 'cover', flex: 3, alignItems: 'center' }} />
                            <View style={styles.memberContainer}>
                                <Ionicons name="person-circle-outline" size={36} color="#E8AE79" />
                                <Text style={styles.name}>{truncateText(item.payer, 3)}</Text>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default Split;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f9',
    },
    emptySpendView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyIcon: {
        marginBottom: 20,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 10,
    },
    memberContainer: {
        alignItems: 'center',
        flex: 3,
    },
    name: {
        fontSize: 10,
        color: '#616161',
    },
    price: {
        flex: 7,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#5DAF6A',
        textAlign: 'center',
    },
    arrow: {
        flex: 2,
        textAlign: 'center',
    },
});
