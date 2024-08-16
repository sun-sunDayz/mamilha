import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const GroupCategory = ({ onChangeCategory }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropdownWidth, setDropdownWidth] = useState(0); 
  const [Data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/groups/category/')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('데이터를 불러오는데 실패했습니다', error);
      });
  }, []);

  useEffect(() => {
    onChangeCategory(selectedItem);
  }, [selectedItem, onChangeCategory]);

  const handleItemPress = (item) => {
    setSelectedItem(item.category_name);
    setDropdownOpen(false);
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
        <Text style={[styles.dropdownButtonText, { color: selectedItem ? '#000000' : '#C0C0C0' }]}>
          {selectedItem ? selectedItem : '카테고리 선택'}
        </Text>
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
                    <Text style={[styles.dropdownItemText, {color: item.category_name === selectedItem ? '#ffffff': '#000000'}]}>
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
  },
  dropdownButtonText: {
    fontSize: 18,
    color: '#C0C0C0',
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
  selectedDropdownItem:{
    padding: 10,
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: "#5DAF6A",
  },
  dropdownItemText: {
    fontSize: 16,
  },
});
