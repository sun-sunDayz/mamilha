import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'

const GroupMember = ({ onChangeMembers, onAddMember}) => {
    const [inputs, setInputs] = useState([{ id: 1, name: '', active: 1 }]);

    useEffect(() => {
        onChangeMembers(inputs);
    }, [inputs, onChangeMembers]);

    const addInput = () => {
        const newId = inputs.length > 0 ? inputs[inputs.length - 1].id + 1 : 1;
        setInputs([...inputs, { id: newId, name: '', active: 1 }]);
        onAddMember();
    };

    const deleteInput = (id) => {
        if (inputs.length > 1) {
            setInputs(inputs.filter(input => input.id !== id));
        } else if (inputs.length == 1) {
            setInputs([{ id: 1, name: '', active: 1 }])
        }
    };

    return (
        <View>
            <View>
                {inputs.map((input, index) => (
                    <View key={input['id']} >
                        <TextInput
                            style={styles.input}
                            placeholder="멤버 별명 입력"
                            keyboardType="default"
                            value={input['name']}
                            onChangeText={(text) => {
                                const newInputs = inputs.map(item =>
                                    item.id === input.id ? { ...item, name: text } : item);
                                setInputs(newInputs);
                            }}
                        />
                        <TouchableOpacity onPress={() => deleteInput(input.id)} style={styles.deleteButton}>
                            <Ionicons name="trash-outline" size={18} color='#C65757' />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <View style={{ alignItems: 'center', marginTop: 10 }}>
                <TouchableOpacity onPress={addInput} style={styles.addButton}>
                    <Ionicons name="add-circle" size={35} color='#5DAF6A' />
                </TouchableOpacity>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        fontSize: 18,
        marginTop: 10,
        padding: 10,
        paddingLeft: 15,
        backgroundColor: '#ffffff',
        borderRadius: 15,
    },
    addButton: {
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
