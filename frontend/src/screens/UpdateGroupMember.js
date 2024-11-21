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
import Ionicons from 'react-native-vector-icons/Ionicons';
import GroupMember from '../components/GroupMember';
import {useMemberContext} from '../memberContext'

const UpdateGroupMember = ({navigation, route}) => {
  const currentUser = useContext(UserContext);
  const [id, setId] = useState(''); // 아이디는 일반적으로 수정하지 않으므로 기본값을 설정
  const initialData = {
    id: route.params.id,
    username: route.params.username,
    nickname: route.params.nickname,
    grade: route.params.grade,
    isActive: route.params.isActive,
  }
  const {updateMemberData} = useMemberContext();

  useEffect(() => {
  }, [currentUser]);

  useEffect(() => {
    // console.log('', initialData)
  }, []);

  const handleSave = (newMemberData) => {
    updateMemberData(newMemberData);
    navigation.goBack()
  }; 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={30} color="#616161" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>멤버 정보</Text>
        </View>
        <View style={styles.emptyIcon}></View>
      </View>
      <GroupMember buttonLabel="수정하기" initialData={initialData} onSubmit={handleSave}/>
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

export default UpdateGroupMember;
