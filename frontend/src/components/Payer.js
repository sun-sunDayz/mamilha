import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import apiClient from '../services/apiClient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Payer = ({groupId, onChangePayer, selectedPayer}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(selectedPayer);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const [Data, setData] = useState([]);

  useEffect(() => {
    apiClient
      .get(`/api/groups/${groupId}/members/`)
      .then(response => {
        setData(response.data);
        console.log(selectedPayer);
        if (selectedPayer) {
          setSelectedItem(selectedPayer);
        }
      })
      .catch(error => {
        console.error('멤버 데이터를 불러오는데 실패했습니다', error);
      });
  }, [groupId, selectedPayer]);

  useEffect(() => {
    setSelectedItem(selectedPayer);
  }, [selectedPayer]);

  useEffect(() => {
    onChangePayer(selectedItem);
  }, [selectedItem, onChangePayer]);

  const handleItemPress = item => {
    setSelectedItem(item.id);
    setDropdownOpen(false);
  };

  const getSelectedPayerName = () => {
    const selectedPayer = Data.find(item => item.id === selectedItem);
    return selectedPayer ? selectedPayer.name : '결제자 선택';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDropdownOpen(!isDropdownOpen)}
        onLayout={event => {
          const {width} = event.nativeEvent.layout;
          setDropdownWidth(width);
        }}>
        <Text
          style={[
            styles.dropdownButtonText,
            {color: selectedItem ? '#434343' : '#ADAFBD'},
          ]}>
          {getSelectedPayerName()}
        </Text>
        <View style={styles.dropdownIcon}>
          <Ionicons name="chevron-expand" size={20} color="#ADAFBD" />
        </View>
      </TouchableOpacity>

      {isDropdownOpen && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isDropdownOpen}
          onRequestClose={() => setDropdownOpen(false)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setDropdownOpen(false)}>
            <View style={[styles.dropdown, {width: dropdownWidth}]}>
              <FlatList
                data={Data}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={
                      item.id === selectedItem
                        ? styles.selectedDropdownItem
                        : styles.dropdownItem
                    }
                    onPress={() => handleItemPress(item)}>
                    <Text
                      style={[
                        styles.dropdownItemText,
                        {
                          color:
                            item.id === selectedItem ? '#ffffff' : '#434343',
                        },
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // GroupCategory와 동일한 스타일 적용
  container: {},
  dropdownButton: {
    height: 40,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFFFFF',
    width: '95%',
    marginLeft: 8,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#ADAFBD',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#cccccc',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 10,
  },
  dropdownItem: {
    padding: 10,
    alignItems: 'center',
  },
  selectedDropdownItem: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#5DAF6A',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  dropdownIcon: {
    position: 'absolute',
    right: 20,
    top: 10,
    height: 25,
  },
});

export default Payer;