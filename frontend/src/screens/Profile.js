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
import {updateProfile} from '../api/Accounts';
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
          value={id}
          editable={false} // 아이디는 수정 불가능하게 설정
          style={[styles.input, {backgroundColor: '#D9D9D9'}]} // 수정 불가능한 필드는 배경색을 다르게 설정
        />

        <Text style={styles.label}>비밀번호</Text>
        <TouchableOpacity
          style={styles.passwordButton}
          onPress={handlePasswordChange}>
          <Text style={styles.passwordButtonText}>비밀번호 변경</Text>
        </TouchableOpacity>

        <Text style={styles.label}>이메일</Text>
        <TextInput
          placeholder="이메일 입력"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <Text style={styles.label}>이름</Text>
        <TextInput
          placeholder="이름 입력"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>닉네임</Text>
        <TextInput
          placeholder="닉네임 입력"
          value={nickname}
          onChangeText={setNickname}
          style={styles.input}
        />
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>수정하기</Text>
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
    marginBottom: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'transparent', // 테두리 투명하게 설정
    borderWidth: 1,
    borderRadius: 8, // 모서리를 둥글게 설정
    marginBottom: 16,
    paddingLeft: 8,
    backgroundColor: '#f9f9f9', // 배경색을 살짝 넣어줘서 입력창이 구분되도록 설정
    color: '#434343',
  },
  passwordButton: {
    paddingVertical: 10, // 텍스트 위아래 여백
    paddingHorizontal: 10, // 텍스트 좌우 여백
    alignItems: 'center',
    backgroundColor: '#EDEDED',
    borderColor: '#6C6C6C',
    borderWidth: 0.4,
    borderRadius: 8,
    alignSelf: 'flex-start', // 버튼 크기를 텍스트에 맞게 설정
    marginBottom: 16,
  },
  passwordButtonText: {
    color: '#6C6C6C',
    fontSize: 16,
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
  buttonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
});

export default ProfileScreen;
