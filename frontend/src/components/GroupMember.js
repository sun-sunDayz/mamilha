import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {React, useState, useEffect} from 'react';
import GradeCategory from './GradeCategory';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

const GroupMember = ({initialData = {}, onSubmit, buttonLabel, id}) => {
  const [formData, setFormData] = useState({
    id: initialData.id || null,
    nickname: initialData.nickname || '',
    grade: initialData.grade || null,
    isActive: initialData.isActive || true,
  });

  useEffect(() => {
    // console.log('', initialData)
  }, []);

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (formData.nickname === '') {
      Alert.alert('별명을 입력해주세요');
      return;
    }

    if (formData.grade === null) {
      Alert.alert('등급을 선택해주세요');
      return;
    }

    onSubmit(formData);
  };
  return (
    <View style={styles.content}>
      <View style={styles.formRow}>
        <Text style={styles.label}>아이디</Text>
        <TextInput
          value={id}
          editable={false} // 아이디는 수정 불가능하게 설정
          style={[styles.textInput, styles.disabledInput]}
        />
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label}>별명</Text>
        <TextInput
          placeholder="별명 입력"
          value={formData.nickname}
          onChangeText={(text) => handleChange('nickname', text)} // ID를 업데이트
          style={styles.textInput}
        />
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label}>권한</Text>
        <GradeCategory
          selectedCategory={formData.grade}
          onChangeCategory={text => handleChange('grade', text)} // ID를 업데이트
        />
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label}>상태</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              formData.isActive ? styles.activeTab : styles.inactiveTab,
            ]}
            onPress={() => {
              handleChange('isActive', true)
            }}>
            <Text
              style={[
                styles.tabText,
                formData.isActive ? styles.activeTabText : styles.inactiveTabText,
              ]}>
              활성
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              !formData.isActive ? styles.activeTab : styles.inactiveTab,
            ]}
            onPress={() => {
              handleChange('isActive', false)
            }}>
            <Text
              style={[
                styles.tabText,
                !formData.isActive ? styles.activeTabText : styles.inactiveTabText,
              ]}>
              비활성
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f9',
  },
  content: {
    flex: 1,
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
    marginLeft: 8,
    backgroundColor: 'white',
    borderRadius: 50,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#5DAF6A',
  },
  inactiveTab: {
    backgroundColor: 'white',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: 'white',
  },
  inactiveTabText: {
    color: '#5DAF6A',
  },
});

export default GroupMember;
