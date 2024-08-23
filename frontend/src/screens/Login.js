import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';

const SignUpScreen = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 회원가입 API 호출 로직 추가
    Alert.alert('회원가입 성공!');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ marginBottom: 5 }}>아이디</Text>
      <TextInput
        placeholder="아이디를 입력하세요"
        value={id}
        onChangeText={setId}
        style={styles.input}
      />

      <Text style={{ marginBottom: 5 }}>비밀번호</Text>
      <TextInput
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Text style={{ marginBottom: 5 }}>비밀번호 확인</Text>
      <TextInput
        placeholder="비밀번호를 다시 입력하세요"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <Text style={{ marginBottom: 5 }}>이메일</Text>
      <TextInput
        placeholder="이메일을 입력하세요"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <Text style={{ marginBottom: 5 }}>이름</Text>
      <TextInput
        placeholder="이름을 입력하세요"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Text style={{ marginBottom: 5 }}>닉네임</Text>
      <TextInput
        placeholder="닉네임을 입력하세요"
        value={nickname}
        onChangeText={setNickname}
        style={styles.input}
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  button: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#5DAF6A',
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
});

export default SignUpScreen;


