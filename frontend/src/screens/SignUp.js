import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';

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
      setIdError('아이디를 입력');
      isValid = false;
    } else {
      setIdError('');
    }

    if (password.trim() === '') {
      setPasswordError('비밀번호 입력');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (confirmPassword.trim() === '') {
      setConfirmPasswordError('비밀번호 확인을 입력');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (email.trim() === '') {
      setEmailError('이메일 입력');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (name.trim() === '') {
      setNameError('이름 입력');
      isValid = false;
    } else {
      setNameError('');
    }

    if (nickname.trim() === '') {
      setNicknameError('닉네임 입력');
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
    <View style={{ padding: 20 }}>
      <Text style={{ marginBottom: 5 }}>아이디</Text>
      <TextInput
        placeholder="아이디 입력"
        value={id}
        onChangeText={setId}
        style={styles.input}
      />
      {idError ? <Text style={styles.errorText}>{idError}</Text> : null}

      <Text style={{ marginBottom: 5 }}>비밀번호</Text>
      <TextInput
        placeholder="비밀번호 입력"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <Text style={{ marginBottom: 5 }}>비밀번호 확인</Text>
      <TextInput
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

      <Text style={{ marginBottom: 5 }}>이메일</Text>
      <TextInput
        placeholder="이메일 입력"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <Text style={{ marginBottom: 5 }}>이름</Text>
      <TextInput
        placeholder="이름 입력"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

      <Text style={{ marginBottom: 5 }}>닉네임</Text>
      <TextInput
        placeholder="닉네임 입력"
        value={nickname}
        onChangeText={setNickname}
        style={styles.input}
      />
      {nicknameError ? <Text style={styles.errorText}>{nicknameError}</Text> : null}

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
