import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {UserContext} from '../userContext';
import {updateProfile, logout} from '../api/Accounts';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({navigation}) => {
  const currentUser = useContext(UserContext);
  const [id, setId] = useState(''); // 아이디는 일반적으로 수정하지 않으므로 기본값을 설정
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    if (currentUser) {
      setId(currentUser.username);
      setEmail(currentUser.email);
      setName(currentUser.name);
      setNickname(currentUser.nickname);
    }
  }, [currentUser]);

  const handleSave = async () => {
    // 회원가입 API 호출 로직 추가
    console.log(name, nickname, email);
    const result = await updateProfile(name, nickname, email);
    if (!result) {
      Alert.alert('회원정보 수정 실패');
      return;
    }
    Alert.alert('회원정보 수정 완료');
    navigation.navigate('Main');
  };

  const handlePasswordChange = () => {
    // 비밀번호 변경 페이지로 이동
    navigation.navigate('PasswordChange'); // PasswordChangeScreen 페이지로 이동하도록 설정
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('로그아웃 완료');
      navigation.reset({
        index: 0, // 스택의 첫 번째 화면
        routes: [{name: 'Intro'}], // 새로운 스택에 추가될 화면
      });
    } catch (error) {
      console.log('Logout Error: ', error);
      Alert.alert('로그아웃 실패');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={30} color="#616161" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>내 정보</Text>
        </View>
        <View style={styles.emptyIcon}></View>
      </View>
      <View style={styles.content}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.formRow}>
            <Text style={styles.label}>아이디</Text>
            <TextInput
              value={id}
              editable={false} // 아이디는 수정 불가능하게 설정
              style={[styles.textInput, styles.disabledInput]}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>비밀번호</Text>
            <TouchableOpacity
              style={styles.passwordButton}
              onPress={handlePasswordChange}>
              <Text style={styles.passwordButtonText}>비밀번호 변경</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              placeholder="이메일 입력"
              value={email}
              onChangeText={setEmail}
              style={styles.textInput}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              placeholder="이름 입력"
              value={name}
              onChangeText={setName}
              style={styles.textInput}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              placeholder="닉네임 입력"
              value={nickname}
              onChangeText={setNickname}
              style={styles.textInput}
            />
          </View>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>수정하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2} onPress={handleLogout}>
            <Text style={styles.button2Text}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f9',
  },
  content: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
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
    paddingBottom: 200, // ScrollView 내용물 아래 여유 공간 추가
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
  textInput: {
    height: 40,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFFFFF',
    width: '95%',
    marginLeft: 8,
    color: '#434343',
  },
  disabledInput: {backgroundColor: '#D9D9D9'},
  passwordButton: {
    marginLeft: 8,
    paddingVertical: 10, // 텍스트 위아래 여백
    paddingHorizontal: 10, // 텍스트 좌우 여백
    alignItems: 'center',
    backgroundColor: '#EDEDED',
    borderColor: '#6C6C6C',
    borderWidth: 0.4,
    borderRadius: 8,
    alignSelf: 'flex-start', // 버튼 크기를 텍스트에 맞게 설정
  },
  passwordButtonText: {
    color: '#6C6C6C',
    fontSize: 14,
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

export default ProfileScreen;
