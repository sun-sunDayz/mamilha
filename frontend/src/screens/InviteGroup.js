import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import GroupListItem from '../components/GroupListItem';
import ButtonGroup from '../components/ButtonGroup';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {UserContext} from '../userContext';
import apiClient from '../services/apiClient';

const InviteGroup = ({navigation, route}) => {
  const currentUser = useContext(UserContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('방문자');
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (currentUser) {
      setNickname(currentUser.nickname);
    } else {
      setNickname('손님');
    }
  }, [currentUser]);

  const fetchData = async () => {
    try {
      const response = await apiClient.get(`/api/groups/`);
      setGroups(response.data);
    } catch (error) {
      console.error('데이터를 불러오는데 실패했습니다', error);
    }
  };

  useEffect(() => {
    fetchData(); // 컴포넌트 마운트 시 데이터 fetch
  }, []);

  useEffect(() => {
    fetchData();
  }, [route.params]); // route.params가 변경될 때마다 fetchData 실행

  const onHandleProfile = async () => {
    navigation.navigate('Profile');
  };

  return (
    <SafeAreaView SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="#616161" />
        </TouchableOpacity>
        <Ionicons name="settings-outline" size={30} color="transparent" />
      </View>
      <ButtonGroup onPressButton="CreateGroup" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
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
  nicknameContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  nicknameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  buttonImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 16,
    marginHorizontal: 10,
    fontWeight: '700',
  },
  meetingListContainer: {
    marginTop: 32,
    marginBottom: 10,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  meetingListText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'left',
  },
});

export default InviteGroup;
