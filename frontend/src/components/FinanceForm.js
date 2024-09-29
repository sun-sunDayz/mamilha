import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import apiClient from '../services/apiClient';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';


const FinanceForm = ({initialData = {}, onSubmit, buttonLabel, group_pk}) => {
  const navigation = useNavigation(); // 네비게이션 객체 가져오기
  const [formData, setFormData] = useState({
    date: '',
    finance_type: '지출',
    finance_category: null,
    payer: null,
    pay_method: '카드',
    amount: '',
    description: '',
    member: null,
    split_method: '고정분할',
    ...initialData, // 초기값 설정 (update 에서 사용)
  });

  // 일시 (Date)

  const [date, setDate] = useState(formData.date ? new Date(initialData.date) : null);
  const [open, setOpen] = useState(false);

  const handleConfirm = selectedDate => {
    setDate(selectedDate); // 선택된 날짜 상태 업데이트
    setFormData({...formData, date: moment(selectedDate).format('YYYY-MM-DD')});
    setOpen(false); // DatePicker 모달 닫기
  };

  // 구분 (Type)

  const [selectedType, setSelectedType] = useState(formData.finance_type||'지출'); // 초기값은 '지출'
  const [selectedMethod, setSelectedMethod] = useState(formData.pay_method||'카드'); // 초기값은 '카드'

  // 카테고리 (Category)
  const [categoryData, setCategoryData] = useState([]);
  const [category, setCategory] = useState(null);
  const [isCategoryFocus, setIsCategoryFocus] = useState(false);

  // useEffect를 사용하여 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get(
          '/api/finances/categorys/',
        );
        // API 응답 데이터를 state에 저장
        const categories = response.data.map(item => ({
          label: item.name, // 'labelField'에 해당하는 필드
          value: item.id, // 'valueField'에 해당하는 필드
        }));
        setCategoryData(categories);

        const selectedCategory = categories.find(
          item => item.label === formData.finance_category // 카테고리 비교
        );
        if (selectedCategory) {
          setCategory(selectedCategory.value); // 일치하는 값이 있으면 설정
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [formData.finance_category]); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행


  // 결제자(payer) & 참여 멤버(selected members)
  const [members, setMembers] = useState([]); // 멤버 리스트
  const [payer, setPayer] = useState(formData.payer); // 결제자 선택
  const [selectedMembers, setSelectedMembers] = useState([]); // 선택된 참여 멤버 상태
  // useEffect를 사용하여 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await apiClient.get(
          `/api/groups/${group_pk}/members/`,
          //   'http://localhost:8000/api/groups/${groupPk}/members/',
        );
        // API 응답 데이터를 state에 저장
        const membersData = response.data.map(item => ({
          label: item.name, // 'labelField'에 해당하는 필드
          value: item.id, // 'valueField'에 해당하는 필드
        }));
        setMembers(membersData);

        const selectedPayer = membersData.find(
          item => item.label === formData.payer  // 결제자 비교 
        );
        if (selectedPayer) {
          setPayer(selectedPayer.value); // 일치하는 값이 있으면 설정
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, [formData.payer]); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행

  const [isPayerFocus, setIsPayerFocus] = useState(false);

  const handleChange = (name, value) => {
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = async () => {
    try {
      const response = await apiClient.post(
        // 'http://localhost:8000/api/finances/1/',
        `/api/finances/${group_pk}/`,
        {
          ...formData,
          type: selectedType,
          method: selectedMethod,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );


      if (response.status === 201) {
        alert('지출 등록에 성공했습니다');
        navigation.navigate('Finances', { "group_pk": group_pk })
        // Form reset or navigation can be handled here
      } else {
        alert('저장 실패: ' + result.message);
      }
    } catch (error) {
      alert('저장 중 오류 발생: ' + error.message);
    }
  };

  const handleTypePress = tab => {
    setSelectedType(tab);
  };

  const handleMethodPress = tab => {
    setSelectedMethod(tab);
  };

  const comma = amount => {
    const noCamma = amount.toString().replace(/,/g, '')
    return noCamma.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.formRow}>
            <Text style={styles.label}>일시</Text>
            <TouchableOpacity
              style={styles.timepicker}
              onPress={() => setOpen(true)}>
              <Text
                style={[styles.inputStyleText, date && styles.selectedText]}>
                {date ? moment(date).format('YYYY년 MM월 DD일') : '날짜 선택'}
              </Text>
              <Icon name="chevron-expand" size={20} color="#ADAFBD" />
            </TouchableOpacity>
            <DatePicker
              modal
              open={open}
              date={date || new Date()}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>구분</Text>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedType === '지출'
                    ? styles.activeTab
                    : styles.inactiveTab,
                ]}
                onPress={() => setSelectedType('지출')}>
                <Text
                  style={[
                    styles.tabText,
                    selectedType === '지출'
                      ? styles.activeTabText
                      : styles.inactiveTabText,
                  ]}>
                  지출
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedType === '수입'
                    ? styles.activeTab
                    : styles.inactiveTab,
                ]}
                onPress={() => setSelectedType('수입')}>
                <Text
                  style={[
                    styles.tabText,
                    selectedType === '수입'
                      ? styles.activeTabText
                      : styles.inactiveTabText,
                  ]}>
                  수입
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedType === '정산'
                    ? styles.activeTab
                    : styles.inactiveTab,
                ]}
                onPress={() => setSelectedType('정산')}>
                <Text
                  style={[
                    styles.tabText,
                    selectedType === '정산'
                      ? styles.activeTabText
                      : styles.inactiveTabText,
                  ]}>
                  정산
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.label}>카테고리</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={categoryData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={'카테고리 선택'}
              value={category}
              onFocus={() => setIsCategoryFocus(true)}
              onBlur={() => setIsCategoryFocus(false)}
              onChange={item => {
                setCategory(item.value);
                setIsCategoryFocus(false);
                handleChange('category', item.value);
                setFormData(prevState => ({
                  ...prevState, 
                  finance_category: item.value 
                }));
              }}
            />
          </View>

          <View style={styles.formRow}>
            <Text style={styles.label}>결제자</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={members}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={'결제자 선택'}
              value={payer}
              onFocus={() => setIsPayerFocus(true)}
              onBlur={() => setIsPayerFocus(false)}
              onChange={item => {
                setPayer(item.value);
                setIsPayerFocus(false);
                handleChange('payer', item.value);
              }}
            />
          </View>

          <View style={styles.formRow}>
            <Text style={styles.label}>방식</Text>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedMethod === '카드'
                    ? styles.activeTab
                    : styles.inactiveTab,
                ]}
                onPress={() => {
                  setSelectedMethod('카드')
                  setFormData(prevState => ({
                    ...prevState, 
                    pay_method: '카드' 
                  }));
                }


                }>
                <Text
                  style={[
                    styles.tabText,
                    selectedMethod === '카드'
                      ? styles.activeTabText
                      : styles.inactiveTabText,
                  ]}>
                  카드
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedMethod === '현금'
                    ? styles.activeTab
                    : styles.inactiveTab,
                ]}
                onPress={() => {
                  setSelectedMethod('현금')
                  setFormData(prevState => ({
                    ...prevState, 
                    pay_method: '현금' 
                  }));
                }}>
                <Text
                  style={[
                    styles.tabText,
                    selectedMethod === '현금'
                      ? styles.activeTabText
                      : styles.inactiveTabText,
                  ]}>
                  현금
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.label}>금액</Text>
            <View style={styles.rowContents}>
              <TextInput
                placeholder="금액 입력"
                style={styles.amountInput}
                value={comma(formData.amount)}
                onChangeText={text => handleChange('amount', text)}
              />
              <Text style={styles.contentText}>원</Text>
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.label}>설명</Text>
            <TextInput
              placeholder="설명 입력 (선택)"
              style={styles.descriptionInput}
              multiline
              value={formData.description}
              onChangeText={text => handleChange('description', text)}
            />
          </View>
          {/* 참여 멤버 리스트 (테이블 형식으로 표시) */}
          <View style={styles.formRow}>
            <Text style={styles.label}>참여 멤버</Text>
            <View style={styles.table}>
              {members.map(member => (
                <View key={member.value} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{member.label}</Text>
                  {/* 참여 멤버 선택 시 상태 업데이트 */}
                  {/* <CheckBox
                    value={selectedMembers.includes(member.value)}
                    onValueChange={() => {
                      if (selectedMembers.includes(member.value)) {
                        setSelectedMembers(prev =>
                          prev.filter(id => id !== member.value),
                        );
                      } else {
                        setSelectedMembers(prev => [...prev, member.value]);
                      }
                    }}
                  /> */}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.floatingButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FinanceForm;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 20,
  },
  content: {},
  scrollContainer: {},
  formRow: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  rowContents: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
  },
  label: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    margin: 8,
  },
  input: {
    color: '#434343',
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    width: '95%',
    height: 40,
    padding: 10,
    marginLeft: 8,
    borderRadius: 8,
  },
  timepicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 40,
    width: '56%',
    padding: 10,
    marginLeft: 8,
    borderRadius: 8,
  },
  selectedText: {
    color: '#434343',
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  inputStyleText: {
    color: '#ADAFBD',
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  amountInput: {
    flex: 1,
    color: '#434343',
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    height: 40,
    padding: 10,
    marginLeft: 8,
    marginRight: 10,
    borderRadius: 8,
  },
  descriptionInput: {
    color: '#434343',
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    width: '95%',
    minHeight: 80,
    padding: 10,
    marginLeft: 8,
    borderRadius: 8,
    textAlignVertical: 'top',
  },
  contentText: {
    color: '#434343',
    fontSize: 16,
  },
  floatingButton: {
    position: 'absolute',
    alignSelf: 'center',
    height: 40,
    width: '95%',
    bottom: 0,
    backgroundColor: '#5DAF6A',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: 'white',
  },
  inactiveTabText: {
    color: '#5DAF6A',
  },
  dropdown: {
    height: 40,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFFFFF',
    width: '95%',
    marginLeft: 8,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#ADAFBD',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#434343',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
