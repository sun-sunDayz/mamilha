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
        <View style={styles.formRow}>
          <Text style={styles.label}>새 비밀번호</Text>
          <TextInput
            placeholder="새 비밀번호를 입력하세요"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>
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
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleChangePassword}>
          <Text style={styles.buttonText}>변경하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  label: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    margin: 8,
  },
  input: {
    height: 40,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFFFFF',
    width: '95%',
    marginLeft: 8,
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
  bottomContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    width: '95%',
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
