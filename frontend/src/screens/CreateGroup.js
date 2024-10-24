import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import GroupCategory from '../components/GroupCategory';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiClient from '../services/apiClient';

const CreateGroup = ({navigation}) => {
  const [groupName, setGroupName] = useState('');
  const [groupCategory, setGroupCategory] = useState(null);
  const [currency, setCurrency] = useState('원');
  const [members, setMembers] = useState([{id: 1, name: '', active: 1}]);
  const scrollViewRef = useRef(null);
  const [nickname, setNickname] = useState('');

  const handleCreateGroup = async () => {
    try {
      const payload = {
        name: groupName,
        category_id: groupCategory,
        currency: currency || '원',
        members: [{id: 0, name: nickname, active: 1}, ...members],
      };

      await apiClient.post('/api/groups/', payload);

      setGroupName('');
      setGroupCategory('');
      setCurrency('원');
      setNickname('');
      setMembers([{id: 1, name: '', active: 1}]);

      navigation.navigate('Main');
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        '그룹 생성에 실패했습니다. 다시 시도해주세요.';
      alert(errorMessage);
    }
  };

  const addInput = () => {
    const newId = members.length > 0 ? members[members.length - 1].id + 1 : 1;
    setMembers([...members, {id: newId, name: '', active: 1}]);
    scrollViewRef.current?.scrollToEnd({animated: true});
  };

  const deleteInput = id => {
    if (members.length > 1) {
      setMembers(members.filter(member => member.id !== id));
    } else if (members.length == 1) {
      setMembers([{id: 1, name: '', active: 1}]);
    }
  };

  // 카테고리 (Category)
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState([]);
  // const [isCategoryFocus, setIsCategoryFocus] = useState(false);

  // useEffect를 사용하여 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/api/groups/category/');

        // API 응답 데이터를 state에 저장
        const categories = response.data.map(item => ({
          label: item.category_name, // 'labelField'에 해당하는 필드
          value: item.category_id, // 'valueField'에 해당하는 필드
        }));
        setCategories(categories);

        if (categories.length > 0) {
          setCategory(categories[0].value); // 일치하는 값이 있으면 설정
        }
      } catch (error) {
        console.error('카테고리 못 가져옴:', error);
      }
    };

    fetchCategories();
  }, []);

  // TextInput 값이 변경될 때 호출되는 함수
  const handleChange = (name, value) => {
    if (name === 'amount') {
      (value = value.replace(/,/g, '')), 10;
    }
    setFormData({...formData, [name]: value});
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={30} color="#616161" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>모임 생성</Text>
          </View>
          <Ionicons name="settings-outline" size={30} color="transparent" />
        </View>
        <View style={styles.content}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.ScrollViewContent}>
            <View style={styles.formRow}>
              <Text style={styles.label}>모임 이름</Text>
              <TextInput
                placeholder="모임 이름 입력"
                keyboardType="default"
                placeholderTextColor="#ADAFBD"
                style={styles.GroupNameInput}
                value={groupName}
                onChangeText={setGroupName}
              />
            </View>
            <View style={styles.formRow}>
              <Text style={styles.label}>모임 카테고리</Text>
              <GroupCategory
                selectedCategory={groupCategory} // ID를 전달
                onChangeCategory={setGroupCategory} // ID를 업데이트
              />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.label}>멤버</Text>
              <View style={styles.MemberUserContainer}>
                <TextInput
                  style={styles.MemberUserName}
                  placeholder="내 별명 입력"
                  placeholderTextColor="#ADAFBD"
                  keyboardType="default"
                  value={nickname}
                  onChangeText={setNickname}
                />
                <Text style={styles.MemberUserMe}>(나)</Text>
              </View>
              <View>
                <View>
                  {members.map((input, index) => (
                    <View key={input.id}>
                      <TextInput
                        style={styles.input}
                        placeholder="멤버 별명 입력"
                        placeholderTextColor="#ADAFBD"
                        keyboardType="default"
                        value={input['name']}
                        onChangeText={text => {
                          const newInputs = members.map(item =>
                            item.id === input.id ? {...item, name: text} : item,
                          );
                          setMembers(newInputs);
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => deleteInput(input.id)}
                        style={styles.deleteButton}>
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color="#C65757"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <View style={{alignItems: 'center', marginTop: 10}}>
                  <TouchableOpacity onPress={addInput} style={styles.addButton}>
                    <Ionicons name="add-circle" size={35} color="#5DAF6A" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        <TouchableOpacity
          onPress={handleCreateGroup}
          style={styles.CreateGroupButton}>
          <Text style={styles.CreateGroupButtonText}>생성하기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  TopContainer: {
    position: 'relative',
  },
  CloseIcon: {
    paddingHorizontal: 15,
  },
  TitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 10,
  },
  TitleText: {
    fontSize: 25,
    fontWeight: '700',
    textAlign: 'center',
  },
  GroupNameInput: {
    color: '#434343',
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    width: '95%',
    padding: 10,
    marginLeft: 8,
    borderRadius: 8,
  },
  ScrollViewContent: {
    padding: 10,
    paddingBottom: 150,
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
  iconStyle: {
    width: 20,
    height: 20,
  },
  CreateGroupButton: {
    position: 'absolute',
    alignSelf: 'center',
    width: '80%',
    bottom: 50,
    padding: 13,
    backgroundColor: '#5DAF6A',
    borderRadius: 10,
    alignItems: 'center',
  },
  CreateGroupButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  MemberUserContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: '95%',
    padding: 10,
    marginLeft: 8,
    borderRadius: 8,
  },
  MemberUserName: {
    fontSize: 16,
    color: '#434343',
  },
  MemberUserMe: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5DAF6A',
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#ffffff',
    width: '95%',
    padding: 10,
    marginLeft: 8,
    borderRadius: 8,
    marginTop: 8,
    fontSize: 16,
    color: '#434343',
  },
  addButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    position: 'absolute',
    right: 20,
    top: 16,
    height: 25,
    width: 25,
    borderRadius: 15,
    backgroundColor: '#FFCDCD',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreateGroup;
