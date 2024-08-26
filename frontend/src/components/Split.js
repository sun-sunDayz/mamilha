import { StyleSheet, Text, View, FlatList, Image } from'react-native';
import React from'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const splitList = [
    { id: 1, member1: '박보검', member2: '박보영', amount: 100000 },
    { id: 2, member1: '정은지', member2: '박보영', amount: 300000 },
    { id: 3, member1: '박보검', member2: '정은지', amount: 800000000 },
    { id: 4, member1: '박보영', member2: '박보검', amount: 470000 },
    { id: 5, member1: '해리포터', member2: 'james', amount: 470000 },
];

const calculateFinalBalances = (splitList) => {
    const balances = {};
    splitList.forEach(({ member1, member2, amount }) => {
        if (!balances[member1]) balances[member1] = 0;
        if (!balances[member2]) balances[member2] = 0;
        
        balances[member1] -= amount;
        balances[member2] += amount;
    });
    const payers = [];
    const receivers = [];

    for (const member in balances) {
        const balance = balances[member];
        if (balance < 0) {
            payers.push({ member, amount: Math.abs(balance) });
        } else if (balance > 0) {
            receivers.push({ member, amount: balance });
        }
    }

    const finalSettlements = [];
    while (payers.length && receivers.length) {
        const payer = payers.pop();
        const receiver = receivers.pop();
        
        const settlementAmount = Math.min(payer.amount, receiver.amount);
        finalSettlements.push({
            from: payer.member,
            to: receiver.member,
            amount: settlementAmount,
        });

        payer.amount -= settlementAmount;
        receiver.amount -= settlementAmount;

        if (payer.amount > 0) {
            payers.push(payer);
        }
        if (receiver.amount > 0) {
            receivers.push(receiver);
        }
    }

    return finalSettlements;
};

const finalSettlements = calculateFinalBalances(splitList);

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
            {finalSettlements.length === 0 ? (
                <View style={styles.emptySpendView}>
                    <Ionicons style={styles.emptyIcon} name="checkmark-done-circle" size={150} color="#79C7E8" />
                    <Text style={styles.emptyText}>정산이 모두 완료되었어요!</Text>
                </View>
            ) : (
                <FlatList data={finalSettlements}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <View style={styles.memberContainer}>
                                <Ionicons name="person-circle-outline" size={36} color="#E87979" />
                                <Text style={styles.name}>{truncateText(item.from, 3)}</Text>
                            </View>
                                <Image source={require('../../assets/line.png')} style={{width:6, height:6, flex: 3, alignItems:'center'}}/>
                                <Text style={styles.price}>{truncateAmount(item.amount)}</Text>
                                <Image source={require('../../assets/arrow_right.png')} style={{width:6, height:6, resizeMode: 'cover', flex: 3, alignItems:'center'}}/>
                            <View style={styles.memberContainer}>
                                <Ionicons name="person-circle-outline" size={36} color="#E8AE79" />
                                <Text style={styles.name}>{truncateText(item.to, 3)}</Text>
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
