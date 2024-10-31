import React, {useState, useEffect, useCallback} from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  View,
  TextInput,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import apiClient from '../services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useDebounce from '../api/useDebounce';
import {login} from '../api/Accounts';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SignUpScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');

  const [idError, setIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  const [idUp, setIdUp] = useState('');
  const [passwordUp, setPasswordUp] = useState('');
  const [passwordConfirmUp, setPasswordConfirmUp] = useState('');
  const [emailUp, setEmailUp] = useState('');

  const debounceUsernameUp = useDebounce(idUp, 250);
  const debouncePasswordUp = useDebounce(passwordUp, 250);
  const debouncePasswordConfirmUp = useDebounce(passwordConfirmUp, 250);
  const debounceEmailUp = useDebounce(emailUp, 250);

  const [formValidateChecker, setFormValidateChecker] = useState({
    username: false,
    email: false,
    password: false,
    passwordCheck: false,
  });

  const [capslock, setCapslock] = useState(false);

  const clearInput = () => {
    setName('')
    setNickname('');
  
    setIdError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setEmailError('');
    setNameError('');
    setNicknameError('');
  
    setIdUp('');
    setPasswordUp('');
    setPasswordConfirmUp('');
    setEmailUp('');
  }

  useFocusEffect(
    useCallback(() => {
      clearInput();
    }, []),
  );

  useEffect(() => {
    if (debounceUsernameUp === idUp) {
      checkUserName().then(r => {});
    }
  }, [idUp, debounceUsernameUp]);

  useEffect(() => {
    if (debouncePasswordUp === passwordUp) {
      checkPassword().then(r => {});
    }
  }, [passwordUp, debouncePasswordUp]);

  useEffect(() => {
    if (debouncePasswordConfirmUp === passwordConfirmUp) {
      checkPasswordCheck();
    }
  }, [passwordConfirmUp, debouncePasswordConfirmUp]);

  useEffect(() => {
    if (debounceEmailUp === emailUp) {
      checkEmail().then(r => {});
    }
  }, [emailUp, debounceEmailUp]);

  async function checkUserName() {
    if (idUp === '') {
      setIdError('');
      setFormValidateChecker(prevState => ({
        ...prevState,
        username: false,
      }));
      return;
    }
    const data = {
      data: idUp,
    };

    try {
      const response = await apiClient.post(
        '/api/users/validate/username/',
        data,
      );
      setIdError('');
      setFormValidateChecker(prevState => ({
        ...prevState,
        username: true,
      }));
    } catch (error) {
      setIdError(error.response.data.error);
      setFormValidateChecker(prevState => ({
        ...prevState,
        username: false,
      }));
    }
  }

  async function checkPassword() {
    if (passwordUp === '') {
      setPasswordError('');
      setFormValidateChecker(prevState => ({
        ...prevState,
        password: false,
      }));
      return;
    }

    const data = {
      data: passwordUp,
    };

    try {
      if (capslock) {
        setPasswordError('CapsLock이 켜져있습니다.');
        setFormValidateChecker(prevState => ({
          ...prevState,
          password: false,
        }));
        return;
      }
      const response = await apiClient.post(
        '/api/users/validate/password/',
        data,
      );
      setPasswordError('');
      setFormValidateChecker(prevState => ({
        ...prevState,
        password: true,
      }));
    } catch (error) {
      setPasswordError(error.response.data.error);
      setFormValidateChecker(prevState => ({
        ...prevState,
        password: false,
      }));
    }

    // 상태 업데이트가 완료된 후에 checkPasswordCheck를 호출합니다.
    checkPasswordCheck();
  }

  function checkPasswordCheck() {
    if (passwordConfirmUp === '') {
      setConfirmPasswordError('');
      setFormValidateChecker(prevState => ({
        ...prevState,
        passwordCheck: false,
      }));
      return;
    }

    if (formValidateChecker.password === false) {
      if (capslock) {
        setConfirmPasswordError('CapsLock이 켜져있습니다.');
      } else {
        setConfirmPasswordError('비밀번호를 먼저 확인해주세요.');
        setFormValidateChecker(prevState => ({
          ...prevState,
          passwordCheck: false,
        }));
      }
      return;
    }

    if (passwordConfirmUp === passwordUp) {
      setConfirmPasswordError();
      setFormValidateChecker(prevState => ({
        ...prevState,
        passwordCheck: true,
      }));
    } else {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      setFormValidateChecker(prevState => ({
        ...prevState,
        passwordCheck: false,
      }));
    }
  }

  async function checkEmail() {
    if (emailUp === '') {
      setEmailError('');
      setFormValidateChecker(prevState => ({
        ...prevState,
        email: false,
      }));
      return;
    }

    const data = {
      data: emailUp,
    };

    try {
      const response = await apiClient.post('/api/users/validate/email/', data);
      setEmailError('');
      setFormValidateChecker(prevState => ({
        ...prevState,
        email: true,
      }));
    } catch (error) {
      setEmailError(error.response.data.error);
      setFormValidateChecker(prevState => ({
        ...prevState,
        email: false,
      }));
    }
  }

  const handleSignUp = async () => {
    try {
      await checkUserName();
      await checkPassword();
      await checkPasswordCheck();
      await checkEmail();
    } catch (error) {
      console.log('error', error);
    }

    if (
      formValidateChecker.username === false ||
      formValidateChecker.password === false ||
      formValidateChecker.passwordCheck === false ||
      formValidateChecker.email === false
    ) {
      console.log('fail', formValidateChecker);
      return;
    }

    //회원가입 시 Access Token 제거
    await AsyncStorage.setItem('accessToken', '');
    await AsyncStorage.setItem('refreshToken', '');

    // 회원가입 API 호출 로직 추가
    try {
      const response = await apiClient.post('/api/users/', {
        username: idUp,
        password: passwordUp,
        email: emailUp,
        name: name,
        nickname: nickname,
      });
      if (response.status === 201) {
        // 성공 시 추가 작업 (e.g., 로그인 화면으로 이동)

        Alert.alert('회원가입 성공');
        await login(idUp, passwordUp);
        navigation.navigate('Main');
      } else {
        Alert.alert('회원가입 실패', '알 수 없는 오류가 발생했습니다.');
      }
    } catch (error) {
      if (error.response) {
        // 서버에서의 응답이 있는 경우
        const errorMessage =
          error.response.data.detail || '회원가입에 실패했습니다.';
        Alert.alert('회원가입 실패', errorMessage);
      } else {
        // 네트워크 오류 등
        Alert.alert('회원가입 실패', '서버에 연결할 수 없습니다.');
      }
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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>아이디</Text>
        <TextInput
          placeholder="아이디 입력"
          onChangeText={text => setIdUp(text)}
          autoCapitalize="none"
          style={styles.input}
        />
        {idError ? <Text style={styles.errorText}>{idError}</Text> : null}

        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          placeholder="비밀번호 입력"
          onChangeText={text => setPasswordUp(text)}
          secureTextEntry
          style={styles.input}
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <Text style={styles.label}>비밀번호 확인</Text>
        <TextInput
          placeholder="비밀번호 확인"
          onChangeText={text => setPasswordConfirmUp(text)}
          secureTextEntry
          style={styles.input}
        />
        {confirmPasswordError ? (
          <Text style={styles.errorText}>{confirmPasswordError}</Text>
        ) : null}

        <Text style={styles.label}>이메일</Text>
        <TextInput
          placeholder="이메일 입력"
          onChangeText={text => setEmailUp(text)}
          autoCapitalize="none"
          style={styles.input}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Text style={styles.label}>이름</Text>
        <TextInput
          placeholder="이름 입력"
          value={name}
          onChangeText={text => setName(text.toLowerCase())}
          style={styles.input}
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        <Text style={styles.label}>닉네임</Text>
        <TextInput
          placeholder="닉네임 입력"
          value={nickname}
          onChangeText={text => setNickname(text.toLowerCase())}
          style={styles.input}
        />
        {nicknameError ? (
          <Text style={styles.errorText}>{nicknameError}</Text>
        ) : null}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>가입하기</Text>
      </TouchableOpacity>
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
    color: '#434343',
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
