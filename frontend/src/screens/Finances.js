import {StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Spending from '../components/Spending';
import Split from '../components/Split';

const Finances = () => {
  const [selectedTab, setSelectedTab] = useState('지출'); // 초기값은 '지출'

  const handleTabPress = tab => {
    setSelectedTab(tab);
  };

    return (
        <SafeAreaView SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="chevron-back-outline" size={25} color="gray" />
                <View>
                    <Text style={styles.title}>모임명</Text>
                </View>
                <AntDesign name="setting" size={25} color="gray" />
            </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === '지출' ? styles.activeTab : styles.inactiveTab,
          ]}
          onPress={() => handleTabPress('지출')}>
          <Text
            style={[
              styles.tabText,
              selectedTab === '지출'
                ? styles.activeTabText
                : styles.inactiveTabText,
            ]}>
            지출
          </Text>
        </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        selectedTab === '정산' ? styles.activeTab : styles.inactiveTab,
                    ]}
                    onPress={() => handleTabPress('정산')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            selectedTab === '정산' ? styles.activeTabText : styles.inactiveTabText,
                        ]}
                    >
                        정산
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                {selectedTab === '지출' && <Spending />}
                {selectedTab === '정산' && <Split />}
            </View>
        </SafeAreaView>
    );
};

export default Finances;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#f1f1f9',
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 3,
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
