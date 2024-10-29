import React, {useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import GroupListItem from '../components/GroupListItem';
import ButtonGroup from '../components/ButtonGroup';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {UserContext} from '../userContext';
import apiClient from '../services/apiClient';

const Main = ({navigation}) => {
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

  useEffect(() => {
    apiClient
      .get(`/api/groups/`)
      .then(response => {
        console.log(response.data)
        setGroups(response.data);
      })
      .catch(error => {
        console.error('데이터를 불러오는데 실패했습니다', error);
      });
  }, []);

  const onHandleProfile = async () => {
    navigation.navigate('Profile');
  };

  useFocusEffect(
    useCallback(() => {
      apiClient
      .get(`/api/groups/`)
      .then(response => {
        console.log(response.data)
        setGroups(response.data);
      })
      .catch(error => {
        console.error('데이터를 불러오는데 실패했습니다', error);
      });
    }, []),
  );

  return (
    <SafeAreaView SafeAreaView style={styles.container}>
      <View style={styles.nicknameContainer}>
        <TouchableOpacity
          style={styles.nicknameButton}
          onPress={() => {
            onHandleProfile();
          }}>
          <Ionicons name="person-circle-outline" size={30} color="#5DAF6A" />
          <Text style={styles.buttonText}>{nickname}</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#ADAFBD" />
        </TouchableOpacity>
      </View>
      <ButtonGroup
        onPressFirstButton="CreateGroup"
        onPressSecondButton={() => alert('Button 2 pressed')}
      />
      <View style={styles.meetingListContainer}>
        <Text style={styles.meetingListText}>모임 목록</Text>
      </View>
      <ScrollView>
        {groups.map(group => (
          <GroupListItem
            key={group.id}
            onPress={() =>
              navigation.navigate('Finances', {
                group_pk: group.id,
                title: group.name,
              })
            }
            title={group.name}
            leader={group.leader}
            members={group.members}
            icon={group.category_icon}
            icon_color={group.category_icon_color}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#f1f1f9',
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

export default Main;
