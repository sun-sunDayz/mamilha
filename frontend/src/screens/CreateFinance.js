import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import FinanceForm from '../components/FinanceForm';

const CreateFinance = ({route}) => {
  const navigation = useNavigation(); // 네비게이션 객체 가져오기
  const group_pk = route.params.group_pk;
  const data = route.params.data

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={30} color="#616161" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>지출 등록</Text>
        </View>
        <View style={styles.emptyIcon}></View>
      </View>
      <View style={styles.content}>
        <FinanceForm
          onSubmit="create"
          buttonLabel="생성하기"
          group_pk={group_pk}
          initialData={data}
        />
      </View>
    </SafeAreaView>
  );
};

export default CreateFinance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  emptyIcon: {
    height: 30,
    width: 30,
  },
  content: {
    flex: 1,
  }
});
