import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PasswordChangeScreen = ({navigation}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');

  const handleChangePassword = () => {
    let isValid = true;

    if (newPassword.trim() === '') {
      setNewPasswordError('새 비밀번호를 입력하세요.');
      isValid = false;
    } else if (newPassword.length < 6) {
      setNewPasswordError('비밀번호는 최소 6자 이상이어야 합니다.');
      isValid = false;
    } else {
      setNewPasswordError('');
    }

    if (confirmNewPassword.trim() === '') {
      setConfirmNewPasswordError('새 비밀번호 확인을 입력하세요.');
      isValid = false;
    } else if (newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError('비밀번호가 일치하지 않습니다.');
      isValid = false;
    } else {
      setConfirmNewPasswordError('');
    }

    if (isValid) {
      // 비밀번호 변경 로직 추가
      Alert.alert('비밀번호가 성공적으로 변경되었습니다.');
      navigation.goBack(); // 비밀번호 변경 후 이전 화면으로 돌아가기
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={30} color="#616161" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>회원가입</Text>
        </View>
        <View style={styles.emptyIcon}></View>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>새 비밀번호</Text>
        <TextInput
          placeholder="새 비밀번호를 입력하세요"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          style={styles.input}
        />
        {newPasswordError ? (
          <Text style={styles.errorText}>{newPasswordError}</Text>
        ) : null}

        <Text style={styles.label}>새 비밀번호 확인</Text>
        <TextInput
          placeholder="새 비밀번호를 다시 입력하세요"
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry
          style={styles.input}
        />
        {confirmNewPasswordError ? (
          <Text style={styles.errorText}>{confirmNewPasswordError}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleChangePassword}>
        <Text style={styles.buttonText}>변경하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between', // 컨텐츠와 버튼 사이에 공간 분배
    backgroundColor: '#F1F1F9',
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
    padding: 20,
    paddingBottom: 100, // 버튼 위치 고려하여 패딩 추가
  },
  label: {
    marginBottom: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'transparent', // 테두리 투명하게 설정
    borderWidth: 1,
    borderRadius: 8, // 모서리를 둥글게 설정
    marginBottom: 16,
    paddingLeft: 8,
    backgroundColor: '#f9f9f9', // 배경색을 살짝 넣어줘서 입력창이 구분되도록 설정
    color: '#434343',
  },
  saveButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#5DAF6A',
    borderRadius: 8,
    margin: 20, // 좌우 여백
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
});

export default PasswordChangeScreen;
