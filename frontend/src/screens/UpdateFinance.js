import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import FinanceForm from '../components/FinanceForm';

const EditFinance = () => {
  const navigation = useNavigation(); // 네비게이션 객체 가져오기

  const handleGoBack = () => {
    navigation.goBack(); // 뒤로가기 액션
  };

  // 지출 편집
  const handleUpdate = formData => {
    navigation.goBack(); // 생성 후 뒤로가기
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name="close" size={40} color="#616161" />
        </TouchableOpacity>
        <Text style={styles.headerText}>지출 등록</Text>
        {/* 빈 공간 */}
        <View style={{width: 40}}></View>
      </View>
      <View>
        <FinanceForm
          initialData={financeData}
          onSubmit={handleUpdate}
          buttonLabel="Save"
        />
      </View>
    </SafeAreaView>
  );
};

export default EditFinance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 41,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
