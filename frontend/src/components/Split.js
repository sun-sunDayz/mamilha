import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const splitList = [
    {id: 1, member1: '박보검', member2: '박보영', amount: 100000},
    {id: 2, member1: '정은지', member2: '박보영', amount: 300000},
    {id: 3, member1: '박보검', member2: '정은지', amount: 260000000},
    {id: 4, member1: '박보영', member2: '박보검', amount: 470000},
    {id: 5, member1: '해리포터', member2: 'james', amount: 470000},
];

const truncateText = (text, limit) => {
    if (text.length > limit) {
        return text.substring(0, limit) + '...';
    }
    return text;
};

const truncateAmount = (amount) => {
    if (amount >= 99999999) {
        return'99,999,999...원';
    }
    return amount.toLocaleString() + '원';
};

const Split = () => {
    return (
        <View style={styles.container}>
            {splitList.length === 0 ? (
                <View style={styles.emptySpendView}>
                    <Ionicons style={{marginBottom:20}} name="checkmark-done-circle" size={150} color="#79C7E8" />
                    <Text style={styles.emptyText}>정산이 모두 완료되었어요!</Text>
                </View>
            ) : (
                <FlatList
                    data={splitList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <View style={{
                                alignItems:'center',
                                flex:3,
                            }}>
                                <Ionicons name="person-circle-outline" size={36} color="#E87979" />
                                <Text style={styles.name}>{truncateText(item.member1, 3)}</Text>
                            </View>
                            <Text style={{flex:2, textAlign:'center'}}>------</Text>
                            <Text style={styles.price}>{truncateAmount(item.amount)}</Text>
                            <Text style={{flex:2, textAlign:'center'}}>-----{'>'}</Text>
                            <View style={{
                                alignItems:'center',
                                flex:3,
                            }}>
                                <Ionicons name="person-circle-outline" size={36} color="#E8AE79" />
                                <Text style={styles.name}>{truncateText(item.member2, 3)}</Text>
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
    emptyText: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
    listItem: {
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 10,
    },
    name: {
        fontSize: 10,
        color: '#616161',
    },
    price: {
        flex:7,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#5DAF6A',
        textAlign: 'center'
    },
});
