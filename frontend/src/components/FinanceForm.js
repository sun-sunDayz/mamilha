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
import FinanceCategory from './FinanceCategory';
import Payer from './Payer';

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

  const [date, setDate] = useState(
    formData.date ? new Date(initialData.date) : new Date(),
  );
  const [open, setOpen] = useState(false);

  const handleConfirm = selectedDate => {
    setDate(selectedDate); // 선택된 날짜 상태 업데이트
    setFormData({...formData, date: moment(selectedDate).format('YYYY-MM-DD')});
    setOpen(false); // DatePicker 모달 닫기
  };

  // 구분 (Type)

  const [selectedType, setSelectedType] = useState(
    formData.finance_type || '지출',
  ); // 초기값은 '지출'
  const [selectedMethod, setSelectedMethod] = useState(
    formData.pay_method || '카드',
  ); // 초기값은 '카드'

  // 카테고리 (Category)
  const [financeCategory, setFinanceCategory] = useState(
    formData.finance_category ? formData.finance_category.category_id : null,
  );
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState([]);
  // const [category, setCategory] = useState(formData.finance_category);
  const [isCategoryFocus, setIsCategoryFocus] = useState(false);
  const [isPayerFocus, setIsPayerFocus] = useState(false);

  // 결제자(payer) & 참여 멤버(selected members)
  const [members, setMembers] = useState([]); // 멤버 리스트
  const [payer, setPayer] = useState(formData.payer ? formData.payer : null); // 결제자 선택

  // useEffect를 사용하여 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/api/finances/categorys/');
        // API 응답 데이터를 state에 저장
        const categories = response.data.map(item => ({
          label: item.name, // 'labelField'에 해당하는 필드
          value: item.id, // 'valueField'에 해당하는 필드
        }));
        setCategories(categories);

        if (categories.length > 0) {
          setCategory(categories[0].value); // 일치하는 값이 있으면 설정
        }
      } catch (error) {
        console.error('카테고리 못 가져옴:', error);
      }
    };

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
          checked: true,
          amount: 0,
        }));

        setMembers(membersData);

        if (membersData.length > 0) {
          setPayer(membersData[0].value); // 일치하는 값이 있으면 설정
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
    fetchCategories();
  }, []);

  useEffect(() => {
    setFormData(prevFormData => ({
      ...prevFormData,
      payer: payer,
    }));
    updateMemberDistributeAmount();
  }, [payer]);

  useEffect(() => {
    setFormData(prevFormData => ({
      ...prevFormData,
      finance_category: category,
    }));
  }, [category]);

  // amount값 변경 시 members정보 업데이트
  useEffect(() => {
    updateMemberDistributeAmount();
  }, [formData.amount]);

  const updateMemberDistributeAmount = () => {
    const updatedMembers = distributeAmount(members);
    setMembers(updatedMembers);
  };

  const toggleCheck = index => {
    // checked 값 토글
    setMembers(prevMember => {
      const members = prevMember.map((member, i) =>
        i === index ? {...member, checked: !member.checked} : member,
      );

      // 토글 후 바로 금액 재분배
      return distributeAmount(members);
    });
  };

  // checked된 멤버들에게만 amount를 분배하는 함수
  const distributeAmount = members => {
    const checkedMembers = members.filter(member => member.checked);
    const checkedCount = checkedMembers.length;

    if (checkedCount === 0) {
      return members;
    }

    amount = formData.amount ? formData.amount : 0;

    const totalAmount = parseFloat(amount);
    const baseAmount = Math.floor(totalAmount / checkedCount); // 각 멤버에게 분배할 기본 금액
    const remainder = Math.round(totalAmount % checkedCount); // 나머지 계산

    const newMembers = members.map(member => {
      if (member.checked) {
        const memberIndex = checkedMembers.indexOf(member);
        let newAmount = 0;

        if (payer === member.value) {
          newAmount = baseAmount + remainder;
        } else {
          newAmount = baseAmount;
        }
        // const newAmount =
        //   memberIndex === 0 ? baseAmount + remainder : baseAmount; // 첫 번째 멤버에게 나머지 추가
        return {...member, amount: newAmount};
      }
      return member;
    });

    return newMembers;
  };

  // TextInput 값이 변경될 때 호출되는 함수
  const handleChange = (name, value) => {
    if (name === 'amount') {
      (value = value.replace(/,/g, '')), 10;
    }
    setFormData({...formData, [name]: value});
  };

  // 소수점 처리 함수
  const distributePrice = (totalPrice, count) => {
    const baseAmount = Math.floor(totalPrice / count); // 소수점 아래를 버린 기본 금액
    const remainder = totalPrice - baseAmount * count; // 나머지 (몰아줄 금액)

    // 멤버들에게 배정된 금액 리스트
    const amounts = Array(count).fill(baseAmount);

    // 첫 번째 멤버에게 나머지를 추가로 몰아줌
    if (remainder > 0) {
      amounts[0] += remainder;
    }

    return amounts;
  };

  const handleSubmit = async () => {
    const checkedCount = members.filter(member => member.checked).length;

    if (checkedCount === 0) {
      alert('참여 멤버를 선택해 주세요.');
      return;
    }

    // 총 가격을 참여한 멤버 수로 나눠서 금액을 배분
    const totalPrice = parseFloat(formData.price);
    const memberAmounts = distributePrice(totalPrice, checkedCount); // 금액 배분

    // 선택된 멤버와 각 멤버에게 배정된 금액을 매핑
    const selectedMembers = members
      .filter(member => member.checked)
      .map((member, index) => ({
        id: member.value,
        amount: member.amount,
      }));

    try {
      const response = await apiClient.post(
        // 'http://localhost:8000/api/finances/1/',
        `/api/finances/${group_pk}/`,
        {
          ...formData,
          type: selectedType,
          method: selectedMethod,
          members: selectedMembers,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 201) {
        alert('지출 등록에 성공했습니다');
        navigation.navigate('Finances', {group_pk: group_pk});
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
    const noCamma = amount.replace(/,/g, '');
    return noCamma.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <View style={styles.formContainer}>
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
            <FinanceCategory
              selectedCategory={financeCategory}
              onChangeCategory={setFinanceCategory} // ID를 업데이트
            />
          </View>

          <View style={styles.formRow}>
            <Text style={styles.label}>결제자</Text>
            <Payer
              groupId={group_pk}
              selectedPayer={payer}
              onChangePayer={setPayer}
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
                  setSelectedMethod('카드');
                  setFormData(prevState => ({
                    ...prevState,
                    pay_method: '카드',
                  }));
                }}>
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
                  setSelectedMethod('현금');
                  setFormData(prevState => ({
                    ...prevState,
                    pay_method: '현금',
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
                keyboardType="numeric"
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
              {members.map((member, index) => (
                <View key={member.value} style={styles.tableRow}>
                  <TouchableOpacity onPress={() => toggleCheck(index)}>
                    <Icon
                      name={
                        member.checked ? 'checkmark-circle' : 'ellipse-outline'
                      }
                      size={24}
                      color={member.checked ? '#5DAF6A' : '#ADAFBD'}
                    />
                  </TouchableOpacity>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableText}>{member.label}</Text>
                    <Text style={styles.tablePrice}>
                      {member.checked
                        ? `${comma(member.amount.toString())}원`
                        : '0원'}
                    </Text>
                  </View>
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
  formContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  content: {paddingBottom: 120},
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
    bottom: 60,
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
  table: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
    width: '95%',
    marginLeft: 8,
  },
  tableRow: {
    flexDirection: 'row',
    width: '100%',
    borderColor: '#ADAFBD',
    borderBottomWidth: 0.3,
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  tableCell: {
    marginLeft: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '86%',
  },
  tableText: {},
  tablePrice: {},
});
