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

const GradeCategory = ({onChangeCategory, selectedCategory}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(selectedCategory);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const [gradeList, setGradeList] = useState([]);

  useEffect(() => {
    apiClient
      .get('/api/groups/members/grades/')
      .then(response => {
        setGradeList(response.data);
        if (selectedCategory) {
          setSelectedItem(selectedCategory);
        }
      })
      .catch(error => {
        console.error('등급 카테고리 데이터를 불러오는데 실패했습니다', error);
      });
  }, []);

  useEffect(() => {
  }, [selectedItem])

  const handleItemPress = item => {
    setSelectedItem(item);
    setDropdownOpen(false);
    onChangeCategory(item);
  };

  const getSelectedCategoryName = () => {
    const selectedCategory = gradeList.find(item => item.id === selectedItem.id);
    return selectedCategory ? selectedCategory.name : '등급 선택';
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
          {getSelectedCategoryName()}
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
                data={gradeList}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) =>
                  item.visible && (
                    <TouchableOpacity
                      style={
                        item.id === selectedItem.id
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
                  )
                }
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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

export default GradeCategory;
