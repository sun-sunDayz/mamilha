import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

const ProfileScreen = ({ navigation }) => {
  const [id, setId] = useState('your_id');  // 아이디는 일반적으로 수정하지 않으므로 기본값을 설정
  const [email, setEmail] = useState('your_email@example.com');
  const [name, setName] = useState('홍길동');
  const [nickname, setNickname] = useState('your_nickname');

  const handleSave = () => {
    // 프로필 저장 로직 추가
    

    Alert.alert('프로필이 저장되었습니다.');
  };

  const handlePasswordChange = () => {
    // 비밀번호 변경 페이지로 이동
    navigation.navigate('PasswordChange'); // PasswordChangeScreen 페이지로 이동하도록 설정
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>아이디</Text>
        <TextInput
          value={id}
          editable={false}  // 아이디는 수정 불가능하게 설정
          style={[styles.input, { backgroundColor: '#f0f0f0' }]}  // 수정 불가능한 필드는 배경색을 다르게 설정
        />

        <Text style={styles.label}>비밀번호</Text>
        <TouchableOpacity style={styles.passwordButton} onPress={handlePasswordChange}>
          <Text style={styles.passwordButtonText}>비밀번호 변경</Text>
        </TouchableOpacity>

        <Text style={styles.label}>이메일</Text>
        <TextInput
          placeholder="이메일을 입력하세요"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <Text style={styles.label}>이름</Text>
        <TextInput
          placeholder="이름을 입력하세요"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>닉네임</Text>
        <TextInput
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChangeText={setNickname}
          style={styles.input}
        />
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>수정하기</Text>
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
  passwordButton: {
    paddingVertical: 10, // 텍스트 위아래 여백
    paddingHorizontal: 15, // 텍스트 좌우 여백
    alignItems: 'center',
    backgroundColor: '#5DAF6A',
    borderRadius: 8,
    alignSelf: 'flex-start', // 버튼 크기를 텍스트에 맞게 설정
    marginBottom: 20,
  },
  passwordButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
