import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {login} from '../api/Accounts';
import {SafeAreaView} from 'react-native-safe-area-context';

const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async e => {
    const result = await login(username, password);
    if (result) {
      setError('');
      navigation.navigate('Main');
    } else {
      setError('로그인에 실패했습니다.');
    }
  };

<<<<<<< HEAD
  const handleSignup = () => {
    navigation.navigate('SignUp');
  };

=======
>>>>>>> ec327251560c0c68d99a6bfb3972d98b7b78b11a
  const handleUsernameChange = text => {
    const formattedText = text.charAt(0).toLowerCase() + text.slice(1);
    setUsername(formattedText);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mamilha</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, styles.topInput]}
          placeholder="아이디"
          value={username}
          onChangeText={handleUsernameChange}
        />
        <View style={styles.separator} />
        <TextInput
          style={[styles.input, styles.bottomInput]}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
      </View>
      <View style={styles.errorContainer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
<<<<<<< HEAD

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>회원가입</Text>
      </TouchableOpacity>
=======
>>>>>>> ec327251560c0c68d99a6bfb3972d98b7b78b11a
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
<<<<<<< HEAD
    marginBottom: 12, // 로그인 버튼 아래 공간 추가
=======
>>>>>>> ec327251560c0c68d99a6bfb3972d98b7b78b11a
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
<<<<<<< HEAD
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
=======
>>>>>>> ec327251560c0c68d99a6bfb3972d98b7b78b11a
});

export default Login;
