import React, { useState } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const SignUpScreen = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');

  const [idError, setIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  const handleSignUp = () => {
    let isValid = true;

    if (id.trim() === '') {
      setIdError('아이디를 입력하세요.');
      isValid = false;
    } else {
      setIdError('');
    }

    if (password.trim() === '') {
      setPasswordError('비밀번호를 입력하세요.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (confirmPassword.trim() === '') {
      setConfirmPasswordError('비밀번호 확인을 입력하세요.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (email.trim() === '') {
      setEmailError('이메일을 입력하세요.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (name.trim() === '') {
      setNameError('이름을 입력하세요.');
      isValid = false;
    } else {
      setNameError('');
    }

    if (nickname.trim() === '') {
      setNicknameError('닉네임을 입력하세요.');
      isValid = false;
    } else {
      setNicknameError('');
    }

    if (isValid) {
      // 회원가입 API 호출 로직 추가
      Alert.alert('회원가입 성공!');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>아이디</Text>
        <TextInput
          placeholder="아이디를 입력하세요"
          value={id}
          onChangeText={setId}
          style={styles.input}
        />
        {idError ? <Text style={styles.errorText}>{idError}</Text> : null}

        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <Text style={styles.label}>비밀번호 확인</Text>
        <TextInput
          placeholder="비밀번호를 다시 입력하세요"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

        <Text style={styles.label}>이메일</Text>
        <TextInput
          placeholder="이메일을 입력하세요"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Text style={styles.label}>이름</Text>
        <TextInput
          placeholder="이름을 입력하세요"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        <Text style={styles.label}>닉네임</Text>
        <TextInput
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChangeText={setNickname}
          style={styles.input}
        />
        {nicknameError ? <Text style={styles.errorText}>{nicknameError}</Text> : null}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100, // 버튼 위치 고려하여 패딩 추가
  },
  label: {
    marginBottom: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'transparent', // 테두리 투명하게 설정
    borderWidth: 1,
    borderRadius: 8, // 모서리를 둥글게 설정
    marginBottom: 12,
    paddingLeft: 8,
    backgroundColor: '#f9f9f9', // 배경색을 살짝 넣어줘서 입력창이 구분되도록 설정
  },
  button: {
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
