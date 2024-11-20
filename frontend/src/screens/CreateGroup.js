import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GroupForm from '../components/GroupForm';

const CreateGroup = ({ navigation, route }) => {
  const userName = route.params.nickname;

  return (
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

        <GroupForm screenName={'CreateGroup'} userName={userName} navigation={navigation}/>

      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F9',
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
});

export default CreateGroup;
