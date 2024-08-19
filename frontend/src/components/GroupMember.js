import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';


const GroupMember = ({ onChangeMembers, onAddMember, selectedMembers }) => {
    const [inputs, setInputs] = useState([{ id: 1, name: '' ,active: 1}]);

    useEffect(() => {
        if (Array.isArray(selectedMembers) && selectedMembers.length === 0) {
            setInputs([{ id: 1, name: '', active: 1 }]);
        }
    }, [selectedMembers]);

    useEffect(() => {
        onChangeMembers(inputs);
    }, [inputs, onChangeMembers]);

    const addInput = () => {
        const newId = inputs.length > 0 ? inputs[inputs.length - 1].id + 1 : 1;
        setInputs([...inputs, { id: newId, name: '' ,active: 1}]);
        onAddMember();
    };

    const deleteInput = (id) => {
        if (inputs.length > 1) {
            setInputs(inputs.filter(input => input.id !== id));
        }
    };
    console.log(selectedMembers, 3)
    console.log(inputs, 4)
    return (
        <View style={{ margin: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: '600' }}>멤버</Text>
            <View
                style={{
                    borderRadius: 15,
                    backgroundColor: '#ffffff',
                    marginTop: 10,
                    padding: 10,
                    paddingLeft: 15,
                    flexDirection: 'row'
                }}
            >
                <Text style={{ fontSize: 18, color: '#000000' }}>닉네임</Text>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#5DAF6A',
                        marginTop: -2,
                        marginLeft: 5
                    }}
                >(나)</Text>
            </View>
            <View>
                <View>
                    {inputs.map((input, index) => (
                        <View key={input.id} >
                            <TextInput
                                style={styles.input}
                                placeholder="멤버 별명 입력"
                                keyboardType="default"
                                value={input.name}
                                onChangeText={(text) => {
                                    const newInputs = inputs.map(item =>
                                        item.id === input.id ? { ...item, name: text } : item);
                                    setInputs(newInputs);
                                }}
                            />
                            <TouchableOpacity onPress={() => deleteInput(input.id)} style={styles.deleteButton}>
                                <Feather name="trash-2" size={18} color='#ffffff' />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <TouchableOpacity onPress={addInput} style={styles.addButton}>
                        <Feather name="plus" size={35} color='#ffffff' />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        height:40,
        fontSize: 18,
        marginTop: 10,
        padding: 10,
        paddingLeft: 15,
        backgroundColor: '#ffffff',
        borderRadius: 15,
    },
    addButton: {
        backgroundColor: '#5DAF6A',
        borderRadius: 100,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    deleteButton: {
        position: 'absolute',
        right: 12,
        top: 18,
        height: 25,
        width: 25,
        borderRadius: 15,
        backgroundColor: '#FFCDCD',
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default GroupMember;
