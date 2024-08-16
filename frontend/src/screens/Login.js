import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('아이디 또는 비밀번호를 다시 확인하세요'); // 에러 메시지 상태

  const handleLogin = () => {
    if (username === 'admin' && password === 'password') {
      setError(''); // 로그인 성공 시 에러 메시지 초기화
      Alert.alert('Login Successful', 'Welcome to Mamilha!');
    } else {
      setError('아이디 또는 비밀번호를 다시 확인하세요'); // 로그인 실패 시 에러 메시지 설정
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mamilha</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, styles.topInput]}
          placeholder="아이디"
          value={username}
          onChangeText={setUsername}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#fff',
  },
  topInput: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  bottomInput: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
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
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Login;

