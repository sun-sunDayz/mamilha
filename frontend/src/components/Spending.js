import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';

const spendList = [
    {id: 1, icon: '1', name: '마밀마라탕', payer: '이준서', date: '2024.08.01', price: 58000000},
    {id: 2, icon: '2', name: '마밀마라탕', payer: '이준서', date: '2024.08.01', price: 580000},
    {id: 3, icon: '3', name: '마밀마라탕', payer: '이준서', date: '2024.08.01', price: 580000},
    {id: 4, icon: '4', name: '마밀마라탕', payer: '이준서', date: '2024.08.01', price: 580000},
    {id: 5, icon: '5', name: '마밀마라탕', payer: '이준서', date: '2024.08.01', price: 580000},
    {id: 6, icon: '6', name: '마밀마라탕', payer: '이준서', date: '2024.08.01', price: 5800000},
];

const getIconStyle = (icon) => {
    switch(icon) {
        case '1':
            return styles.iconRed;
        case '2':
            return styles.iconGreen;
        case '3':
            return styles.iconBlue;
        case '4':
            return styles.iconYellow;
        case '5':
            return styles.iconPurple;
        case '6':
            return styles.iconOrange;
        default:
            return styles.iconDefault;
    }
};

const Spending = () => {
    return (
        <View style={styles.container}>
            {spendList.length === 0 ? (
                <Text style={styles.emptyText}>리스트가 없습니다</Text>
            ) : (
                <FlatList
                    data={spendList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <View style={[styles.iconContainer, getIconStyle(item.icon)]}>
                                <Text style={styles.iconText}>{item.icon}</Text>
                            </View>
                            <View style={styles.details}>
                                <Text style={styles.name}>{item.name}</Text>
                                <View style={{flexDirection: 'row',}}>
                                    <Text style={styles.date}>{item.date}</Text>
                                    <Text style={styles.payer}>결제자</Text>
                                    <Text style={styles.date}>{item.payer}</Text>
                                </View>
                            </View>
                            <View style={{flex:4}}>
                                <Text style={styles.price}>{item.price.toLocaleString()}원</Text>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default Spending;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f9',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 18,
        color: 'gray',
        marginTop: 20,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 10,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    iconText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    iconRed: {
        backgroundColor: '#da7f7c',
    },
    iconGreen: {
        backgroundColor: '#B7E879',
    },
    iconBlue: {
        backgroundColor: '#79C7E8',
    },
    iconYellow: {
        backgroundColor: '#EBE677',
    },
    iconPurple: {
        backgroundColor: '#A379E8',
    },
    iconOrange: {
        backgroundColor: '#E8AE79',
    },
    iconDefault: {
        backgroundColor: 'gray',
    },
    details: {
        flex: 5,
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
    date: {
        fontSize: 11,
        color: 'gray',
        marginTop: 4,
        marginRight:4,
    },
    payer: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#616161',
        marginTop: 4,
        marginRight:4,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'right'
    },
});
