import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Button,
} from 'react-native';
import GroupListItem from '../components/GroupListItem';
import ButtonGroup from '../components/ButtonGroup';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {UserContext} from '../userContext';
import apiClient from '../services/apiClient';

const InviteGroup = ({navigation, route}) => {
  const currentUser = useContext(UserContext);
  const [inviteCode, setInviteCode] = useState('');
  const [errorCode, setErrorCode] = useState('');

  const handleInputChange = (text) => {
    // 입력값에서 소문자를 대문자로 변환하고, A-Z와 0-9만 남기도록 필터링
    const formattedText = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    // 6자리까지만 입력하도록 제한
    setInviteCode(formattedText.slice(0, 6));
  };

  const handleNext = async () => {
    try {
      const response = await apiClient.get(`/api/groups/invite/${inviteCode}/`);
      result = response.data
      console.log(result)
      if(!result.exists) {
        setErrorCode("초대코드가 존재하지 않습니다")
        return
      }
      setErrorCode("")
      navigation.navigate('InviteGroupDetail', {members: result.members, group_pk: result.group_id});
    } catch (error) {
      console.error('데이터를 불러오는데 실패했습니다', error);
    }
  };

  return (
    <SafeAreaView SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="#616161" />
        </TouchableOpacity>
        <Ionicons name="settings-outline" size={30} color="transparent" />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>초대코드를 입력해주세요</Text>
        <TextInput
          style={styles.input}
          placeholder="초대 코드 입력"
          value={inviteCode}
          onChangeText={handleInputChange}
          autoCapitalize="characters"
          maxLength={6} 
        />
        {errorCode ? <Text style={styles.errorText}>{errorCode}</Text> : null}
      </View>
      <TouchableOpacity
          onPress={handleNext}
          style={styles.nextButton}>
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#f1f1f9',
    paddingHorizontal: 20,
  },
  content: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ADAFBD',
    borderBottomWidth: 1,
    paddingHorizontal: 5,
    textAlign: 'left',
  },
  nextButton: {
    position: 'absolute',
    alignSelf: 'center',
    width: '80%',
    bottom: 50,
    padding: 13,
    backgroundColor: '#5DAF6A',
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
  },
});

export default InviteGroup;
