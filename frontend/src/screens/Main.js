import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import ListItem from '../components/ListItem';
import ButtonGroup from '../components/ButtonGroup';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import apiClient from '../services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Cookies from '@react-native-cookies/cookies';

const Main = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('방문자');

  useEffect(() => {
    const setTokensFromCookies = async () => {
      const accessCookies = await Cookies.get('domain');
      const access = accessCookies['access'];
      const refresh = accessCookies['refresh'];
      const id = accessCookies['id'];

      if (access && refresh) {
        await AsyncStorage.setItem('accessToken', access.value);
        await AsyncStorage.setItem('refreshToken', refresh.value);
        await AsyncStorage.setItem('user', id.value);
        Cookies.clearByName('domain', 'access');
        Cookies.clearByName('domain', 'refresh');
        Cookies.clearByName('domain', 'id');
      } else {
        await AsyncStorage.setItem('accessToken', '');
        await AsyncStorage.setItem('refreshToken', '');
        await AsyncStorage.setItem('id', '');
      }
    };
    setTokensFromCookies();
  }, []);

  const getGroupCategory = async () => {
    try {
      const response = await apiClient.get('/api/groups/category/');
      console.log(response.data);
    } catch (error) {
      alert('Test');
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  };

  const addGroup = async () => {
    try {
      const response = await apiClient.post('/api/groups/', {
        name: 'test2',
        category: 'test',
        currency: 'dollar',
        members: [
          {
            name: 'admin',
          },
        ],
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data: ', error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.nicknameContainer}>
        <TouchableOpacity
          style={styles.nicknameButton}
          onPress={() => {
            getGroupCategory();
          }}>
          <AwesomeIcon name="user-circle-o" size={25} color="#5DAF6A" />
          <Text style={styles.buttonText}>{nickname}</Text>
          <EntypoIcon name="chevron-thin-right" size={15} color="#000" />
        </TouchableOpacity>
      </View>
      <ButtonGroup
        onPressFirstButton="CreateGroup"
        onPressSecondButton={() => alert('Button 2 pressed')}
      />
      <View style={styles.meetingListContainer}>
        <Text style={styles.meetingListText}>모임 목록</Text>
      </View>
      <View>
        <ListItem
          onPress={() => addGroup()}
          title="마밀러 클라이밍"
          leader="히키"
          members="15"
        />
        <ListItem
          onPress={() => alert('Button 2 pressed')}
          title="마밀러 힙합 동아리"
          leader="준서"
          members="10"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: '#f1f1f9',
  },
  nicknameContainer: {
    marginTop: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '80%',
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
    width: '80%',
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
    fontSize: 16,
    marginHorizontal: 10,
  },
  meetingListContainer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'flex-start',
    width: '80%',
  },
  meetingListText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
});

export default Main;
