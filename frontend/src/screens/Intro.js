import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const Intro = ({navigation}) => {
  const handleLogin = async () => {
    navigation.navigate('Login'); // 회원가입 페이지로 이동 (적절한 경로로 수정)
  };

  const handleSignup = () => {
    navigation.navigate('SignUp'); // 회원가입 페이지로 이동 (적절한 경로로 수정)
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/mamilha.png')}
        style={{
          width: 150,
          height: 150,
          alignItems: 'center',
          marginBottom: 50,
        }}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>

      {/* 회원가입 버튼 */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>회원가입</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F1F9',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#5DAF6A',
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 12,
  },
  input: {
    width: '100%',
    padding: 10,
    backgroundColor: '#ffffff',
  },
  topInput: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottomInput: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F1F9',
  },
  errorContainer: {
    height: 20, // 고정된 높이 설정
    justifyContent: 'center', // 텍스트가 중앙에 위치하도록 설정
    alignItems: 'flex-start', // 에러 메시지를 왼쪽에 정렬
    marginBottom: 12,
    width: '100%', // 에러 메시지가 입력 필드의 전체 너비를 사용하도록 설정
  },
  errorText: {
    color: 'red', // 에러 메시지 색상 설정
    textAlign: 'left', // 에러 메시지 텍스트를 왼쪽 정렬
  },
  button: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#5DAF6A',
    borderRadius: 10,
    marginBottom: 12, // 로그인 버튼 아래 공간 추가
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
  signupButton: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#ffffff', // 배경 흰색
    borderRadius: 10,
    borderColor: '#5DAF6A',
  },
  signupButtonText: {
    color: '#5DAF6A', // 텍스트 초록색
    fontWeight: '800',
    fontSize: 16,
  },
});

export default Intro;
