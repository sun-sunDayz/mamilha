import React, {useState, useEffect, useContext} from 'react';
import {Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator, View,} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {UserContext} from '../userContext';

const Intro = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const currentUser = useContext(UserContext);

  const handleUsernameChange = text => {
    const formattedText = text.charAt(0).toLowerCase() + text.slice(1);
    setUsername(formattedText);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentUser) {
        navigation.navigate('Main');
      } else {
        setLoading(false); // 1초 후 로딩 화면을 끝내고 버튼을 표시
      }
    }, 1000);

    // 타이머 정리
    return () => clearTimeout(timer);
  }, [currentUser, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/images/mamilha_logo.png')}
        style={styles.image}
      />
      {loading ? (
        <View style={styles.buttonContainer}>
          <ActivityIndicator size="large" color='#616161' />
        </View>
      ) : (
      <View style={styles.buttonContainer}>
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
      </View>
      )}
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
  buttonContainer: {
    width: '100%',
    height: 100,
    // opacity: 0,
  // animation: fadeIn 1s forwards,
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

export default Intro;
