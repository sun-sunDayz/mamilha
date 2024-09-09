import {StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiClient from '../services/apiClient';
import {useNavigation} from '@react-navigation/native';

const getIconStyle = icon => {
  switch (icon) {
    case '외식':
      return styles.iconRed;
    case '주류':
      return styles.iconOrange;
    case '주유':
      return styles.iconYellow;
    case '쇼핑':
      return styles.iconGreen;
    case '교통':
      return styles.iconBlue;
    default:
      return styles.iconPurple;
  }
};

const getIconComponent = icon => {
  switch (icon) {
    case '외식':
      return <Ionicons name="restaurant-outline" size={25} color="white" />;
    case '주류':
      return <Ionicons name="beer-outline" size={25} color="white" />;
    case '주유':
      return <Ionicons name="card-outline" size={25} color="white" />;
    case '쇼핑':
      return <Ionicons name="cart-outline" size={25} color="white" />;
    case '교통':
      return <Ionicons name="car-outline" size={25} color="white" />;
    default:
      return (
        <Ionicons
          name="ellipsis-horizontal-circle-outline"
          size={25}
          color="white"
        />
      );
  }
};

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

const Spending = ({group_pk}) => {
  const [Data, setData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const getFinances = async () => {
      try {
        const response = await apiClient.get(`/api/finances/${group_pk}/`);
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };
    getFinances();
  }, []);


  return (
    <View style={styles.container}>
      {Data.length === 0 ? (
        <View style={styles.emptySpendView}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateFinance')}>
            <Ionicons
              style={{marginBottom: 20}}
              name="add-circle"
              size={150}
              color="#A379E8"
            />
          </TouchableOpacity>
          <Text style={styles.emptyText}>
            아직 등록된 지출 내역이 없습니다.
          </Text>
          <Text style={styles.emptyText}>지출을 등록해주세요!</Text>
        </View>
      ) : (
        <ScrollView>
        <FlatList
          data={Data}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity onPress={()=>navigation.navigate('FinanceDetail',{'group_pk':group_pk, 'finance_pk':item.id})}> 
              <View style={styles.listItem}>
                <View
                  style={[
                    styles.iconContainer,
                    getIconStyle(item.finance_category),
                  ]}>
                  {getIconComponent(item.finance_category)}
                </View>
                <View style={styles.details}>
                  <Text style={styles.name}>
                    {truncateText(item.description, 14)}
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.date}>{item.created_at}</Text>
                    <Text style={styles.payer}>결제자</Text>
                    <Text style={styles.date}>
                      {truncateText(item.payer, 30)}
                    </Text>
                  </View>
                </View>
                <View style={{flex: 4}}>
                  <Text style={styles.amount}>{truncateAmount(item.amount)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        /></ScrollView>
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
    marginRight: 4,
  },
  payer: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#616161',
    marginTop: 4,
    marginRight: 4,
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right',
  },
});
