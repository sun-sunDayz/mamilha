import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CustomText from '../../CustomText';
import moment from 'moment'; // 날짜 처리를 위해 moment 사용

const truncateText = (text, limit) => {
  if (text.length > limit) {
    return text.substring(0, limit) + '...';
  }
  return text;
};

const truncateAmount = amount => {
  if (amount >= 999999999) {
    return '999,999,999...';
  }
  return amount.toLocaleString() + '원';
};

const Spending = ({ group_pk }) => {
  const [Data, setData] = useState([]);
  const navigation = useNavigation();

  const getFinances = async () => {
    try {
      const response = await apiClient.get(`/api/finances/${group_pk}/`);
      // 날짜를 기반으로 데이터 정렬
      const sortedData = response.data.sort((a, b) => new Date(a.date) - new Date(b.date)).reverse();
      setData(sortedData);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };
  
  useEffect(() => {
    getFinances();
  }, []);

  const handelCreateFinance = () => {
    navigation.navigate('CreateFinance', { group_pk: group_pk });
  };

  useFocusEffect(
    useCallback(() => {
      getFinances();
    }, []),
  );

  let lastDate = ''; // 마지막 날짜를 저장할 변수

  return (
    <View style={styles.container}>
      {Data.length === 0 ? (
        <View style={styles.emptySpendView}>
          <TouchableOpacity onPress={() => handelCreateFinance()}>
            <Ionicons
              style={{ marginBottom: 20 }}
              name="add-circle"
              size={150}
              color="#A379E8"
            />
          </TouchableOpacity>
          <CustomText style={styles.emptyText}>
            아직 등록된 지출 내역이 없습니다.
          </CustomText>
          <CustomText style={styles.emptyText}>지출을 등록해주세요!</CustomText>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollView}>
            {Data.map(item => {
              const currentDate = moment(item.date).format('YYYY.MM.DD'); // 현재 아이템의 날짜
              const showDate = currentDate !== lastDate; // 현재 날짜와 마지막 날짜가 다르면 표시
              lastDate = currentDate; // 마지막 날짜 업데이트

              return (
                <View key={item.id.toString()}>
                  {showDate && (
                    <View style={styles.dateContainer}>
                      <Text style={styles.dateText}>{currentDate}</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('FinanceDetail', {
                        group_pk: group_pk,
                        finance_pk: item.id,
                      });
                    }}>
                    <View style={styles.listItem}>
                      <View
                        style={[
                          styles.iconContainer,
                          styles[item.finance_category_icon_color] || styles.iconPurple,
                        ]}>
                        <Ionicons
                          name={item.finance_category_icon || 'ellipsis-horizontal-circle-outline'}
                          size={25}
                          color="white"
                        />
                      </View>
                      <View style={styles.details}>
                        <CustomText style={styles.name}>
                          {truncateText(item.description, 14)}
                        </CustomText>
                        <View style={{ flexDirection: 'row', marginTop: 'auto' }}>
                          <CustomText style={styles.payer}>결제자</CustomText>
                          <CustomText style={styles.date}>
                            {truncateText(item.payer, 30)}
                          </CustomText>
                        </View>
                      </View>
                      <View style={{ flex: 4 }}>
                        <CustomText style={styles.amount}>{truncateAmount(item.amount)}</CustomText>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
            <View style={styles.addButtonContainer}>
              <TouchableOpacity
              style={styles.addButton}
              activeOpacity={1}
              onPress={() => handelCreateFinance()} 
              >
                <Ionicons name="add-circle" size={50} color="#5DAF6A" />
              </TouchableOpacity>
            </View>
        </>
      )}
    </View>
  );
};

export default Spending;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f9',
    position: 'relative',
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
    backgroundColor: '#616161',
  },
  details: {
    flex: 5,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  date: {
    fontSize: 12,
    color: '#616161',
    marginTop: 4,
    marginRight: 4,
  },
  payer: {
    fontSize: 12,
    fontWeight: '700',
    color: '#616161',
    marginTop: 4,
    marginRight: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right',
  },
  scrollView: {
    flexGrow: 1,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  addButton: {
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dateContainer: {
    alignItems: 'left',
    marginBottom: 10,
    marginTop: 15
  },
  dateText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
});
