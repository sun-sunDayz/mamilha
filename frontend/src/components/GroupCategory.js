import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import apiClient from '../services/apiClient';
import Ionicons from 'react-native-vector-icons/Ionicons'

const GroupCategory = ({ onChangeCategory, selectedCategory }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(selectedCategory);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const [Data, setData] = useState([]);

  useEffect(() => {
    apiClient.get('/api/groups/category/')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('데이터를 불러오는데 실패했습니다', error);
      });
  }, []);

  const handleItemPress = (item) => {
    setSelectedItem(item.category_name);
    setDropdownOpen(false);
    onChangeCategory(item.category_name);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDropdownOpen(!isDropdownOpen)}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setDropdownWidth(width);
        }}
      >
        <Text style={[styles.dropdownButtonText, { color: selectedItem ? '#000000' : '#ADAFBD' }]}>
          {selectedItem ? selectedItem : '카테고리 선택'}
        </Text>
        <View style={styles.dropdownIcon}>
          <Ionicons name="chevron-expand" size={20} color='#ADAFBD' />
        </View>
      </TouchableOpacity>

      {isDropdownOpen && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isDropdownOpen}
          onRequestClose={() => setDropdownOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setDropdownOpen(false)}
          >
            <View style={[styles.dropdown, { width: dropdownWidth }]}>
              <FlatList
                data={Data}
                keyExtractor={(item) => item.category_id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={item.category_name === selectedItem ? styles.selectedDropdownItem : styles.dropdownItem}
                    onPress={() => handleItemPress(item)}
                  >
                    <Text style={[styles.dropdownItemText, { color: item.category_name === selectedItem ? '#ffffff' : '#000000' }]}>
                      {item.category_name}
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


export default GroupCategory;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  dropdownButton: {
    padding: 10,
    paddingLeft: 15,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    height: 40,
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
    alignItems: 'center'
  },
  selectedDropdownItem: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: "#5DAF6A",
  },
  dropdownItemText: {
    fontSize: 16,
  },
  dropdownIcon: {
    position: 'absolute',
    right: 20,
    top: 10,
    height: 25
  },
});
