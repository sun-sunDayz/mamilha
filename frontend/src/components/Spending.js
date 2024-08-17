import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const spendList = [
    {id: 1, icon: '1', name: '마밀마라탕', payer: '이준서', date: '2024.08.01', amount: 58000000},
    {id: 2, icon: '2', name: '마밀러맥주', payer: '이준서', date: '2024.08.01', amount: 349586},
    {id: 3, icon: '3', name: '마밀러카드', payer: '홍길동전', date: '2024.08.01', amount: 580000000},
    {id: 4, icon: '4', name: '마밀러맥주', payer: 'david', date: '2024.08.01', amount: 580000},
    {id: 5, icon: '5', name: '마밀러항공', payer: '이준서', date: '2024.08.01', amount: 580000},
    {id: 6, icon: '6', name: '기타 결제', payer: '이준서', date: '2024.08.01', amount: 5800000},
];

const getIconStyle = (icon) => {
    switch(icon) {
        case '1':
            return styles.iconRed;
        case '2':
            return styles.iconOrange;
        case '3':
            return styles.iconYellow;
        case '4':
            return styles.iconGreen;
        case '5':
            return styles.iconBlue;
        default:
            return styles.iconPurple;
    }
};

const getIconComponent = (icon) => {
    switch(icon) {
        case'1':
            return <Ionicons name="restaurant-outline" size={25} color="white" />;
        case'2':
            return <Ionicons name="beer-outline" size={25} color="white" />;
        case'3':
            return <Ionicons name="card-outline" size={25} color="white" />;
        case'4':
            return <Ionicons name="cart-outline" size={25} color="white" />;
        case'5':
            return <Ionicons name="car-outline" size={25} color="white" />;
        default:
            return <Ionicons name="ellipsis-horizontal-circle-outline" size={25} color="white" />;
    }
};

const truncateText = (text, limit) => {
    if (text.length > limit) {
        return text.substring(0, limit) + '...';
    }
    return text;
};

const truncateAmount = (amount) => {
    if (amount >= 99999999) {
        return'99,999,999...';
    }
    return amount.toLocaleString() + '원';
};

const Spending = () => {
    return (
        <View style={styles.container}>
            {spendList.length === 0 ? (
                <View style={styles.emptySpendView}>
                    <Ionicons style={{marginBottom:20}} name="add-circle" size={150} color="#A379E8" />
                    <Text style={styles.emptyText}>아직 등록된 지출 내역이 없습니다.</Text>
                    <Text style={styles.emptyText}>지출을 등록해주세요!</Text>
                </View>
            ) : (
                <FlatList
                    data={spendList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <View style={[styles.iconContainer, getIconStyle(item.icon)]}>
                                {getIconComponent(item.icon)}
                            </View>
                            <View style={styles.details}>
                                <Text style={styles.name}>{truncateText(item.name, 7)}</Text>
                                <View style={{flexDirection: 'row',}}>
                                    <Text style={styles.date}>{item.date}</Text>
                                    <Text style={styles.payer}>결제자</Text>
                                    <Text style={styles.date}>{truncateText(item.payer, 3)}</Text>
                                </View>
                            </View>
                            <View style={{flex:4}}>
                                <Text style={styles.amount}>{truncateAmount(item.amount)}</Text>
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
    amount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'right'
    },
});
