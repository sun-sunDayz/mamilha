import { StyleSheet, Text, View, FlatList, Image, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiClient from '../services/apiClient';



const truncateText = (text, limit) => {
    if (text != '' & text.length > limit) {
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

const addTransaction = (transactions, giver, receiver, amount, finance_type) => {
    if (!transactions[giver]) {
        transactions[giver] = {};
    }
    if (!transactions[receiver]) {
        transactions[receiver] = {};
    }

    transactions[giver][receiver] = (transactions[giver][receiver] || 0) + amount;
    transactions[receiver][giver] = transactions[receiver][giver] || 0;
}

// 잔액을 계산하는 함수
const calculateBalances = (transactions) => {
    const balances = {};
    for (const giver in transactions) {
        if (!balances[giver]) {
            balances[giver] = 0;
        }
        for (const receiver in transactions[giver]) {
            const amount = transactions[giver][receiver];
            balances[giver] -= amount;
            if (!balances[receiver]) {
                balances[receiver] = 0;
            }
            balances[receiver] += amount;
        }
    }
    return balances;
}

const simplifyBalances = (balances) => {
    const creditors = {};
    const debtors = {};
    const transactions = [];

    // 받는 사람과 주는 사람을 나눔
    for (const person in balances) {
        if (balances[person] > 0) {
            creditors[person] = balances[person];
        } else if (balances[person] < 0) {
            debtors[person] = -balances[person];
        }
    }

    // 주고 받을 금액을 최소화하는 로직
    while (Object.keys(creditors).length && Object.keys(debtors).length) {
        const creditor = Object.keys(creditors).reduce((a, b) => creditors[a] > creditors[b] ? a : b);
        const debtor = Object.keys(debtors).reduce((a, b) => debtors[a] > debtors[b] ? a : b);

        let amount = Math.min(creditors[creditor], debtors[debtor]);

        // debtor가 creditor에게 주어야 하는 돈이 음수인 경우 위치를 바꿈
        if (amount < 0) {
            [debtor, creditor] = [creditor, debtor];
            amount = Math.abs(amount);
        }

        if (amount > 0) {
            transactions.push({ 'debtor': debtor, 'creditor': creditor, 'amount': amount });
        }

        creditors[creditor] -= amount;
        debtors[debtor] -= amount;

        if (creditors[creditor] === 0) {
            delete creditors[creditor];
        }
        if (debtors[debtor] === 0) {
            delete debtors[debtor];
        }
    }
    return transactions;
}


const Split = ({ group_pk }) => {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [finalSettlements, setFinalSettlements] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const getSplits = async () => {
        try {
            const response = await apiClient.get(`/api/groups/${group_pk}/splits/`);
            const splits = response.data;
            setData(splits);
            const transactions = {};
            for (const split of splits) {
                addTransaction(transactions, split.member.name, split.payer.name, split.amount, split.finance_type);
            }
            // 잔액 계산 및 출력
            const balances = calculateBalances(transactions);
            const finalTransactions = simplifyBalances(balances);
            setFinalSettlements(finalTransactions);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    // 주고받은 금액 초기화

    useEffect(() => {
        getSplits();
    }, []);

    useFocusEffect(
        useCallback(() => {
            getSplits();
        }, []),
    );

    const handelCreate = (item) => {
        navigation.navigate('CreateFinance', { group_pk: group_pk, data: item });
    };

    return (
        <View style={styles.container}>
            {finalSettlements.length === 0 ? (
                <View style={styles.emptySpendView}>
                    <Ionicons style={styles.emptyIcon} name="checkmark-done-circle" size={150} color="#79C7E8" />
                    <Text style={styles.emptyText}>정산이 모두 완료되었어요!</Text>
                </View>
            ) : (
                <ScrollView
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {finalSettlements.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.listItem}
                            onPress={()=>handelCreate(data[index])}>
                            <View style={styles.memberContainer}>
                                <Ionicons name="person-circle-outline" size={36} color="#E87979" />
                                <Text style={styles.name}>{truncateText(item.debtor, 3)}</Text>
                            </View>
                            <Image
                                source={require('../../assets/line.png')}
                                style={{ width: 6, height: 6, flex: 3, alignItems: 'center' }}
                            />
                            <Text style={styles.price}>{truncateAmount(item.amount)}</Text>
                            <Image
                                source={require('../../assets/arrow_right.png')}
                                style={{ width: 6, height: 6, resizeMode: 'cover', flex: 3, alignItems: 'center' }}
                            />
                            <View style={styles.memberContainer}>
                                <Ionicons name="person-circle-outline" size={36} color="#E8AE79" />
                                <Text style={styles.name}>{truncateText(item.creditor, 3)}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

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
