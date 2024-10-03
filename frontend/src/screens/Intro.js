import React, {useState} from 'react';
import {Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = text => {
    const formattedText = text.charAt(0).toLowerCase() + text.slice(1);
    setUsername(formattedText);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/images/mamilha_logo.png')}
        style={styles.image}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button2}
        onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.button2Text}>회원가입</Text>
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
  image: {height: 204, width: 204, marginBottom: 84},
  separator: {
    height: 1,
    backgroundColor: '#F1F1F9',
  },
  button: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#5DAF6A',
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
  button2: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginTop: 20,
  },
  button2Text: {
    color: '#5DAF6A',
    fontWeight: '800',
    fontSize: 16,
  },
});

export default Login;
