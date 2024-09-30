import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const UpdateMember = ({ onUpdateMembers, selectedMembers }) => {
    const [actives, setActives] = useState(selectedMembers);

    useEffect(() => {
        setActives(selectedMembers);
    }, [selectedMembers]);

    useEffect(() => {
        onUpdateMembers(actives);
    }, [actives]);

    const toggleActive = (id) => {
        setActives(prevActives => {
            return prevActives.map(item =>
                item.id === id ? { ...item, active: item.active === 1 ? 0 : 1 } : item
            );
        });
    };

    return (
        <View>
            {actives.map((active, index) => (
                <View key={active['id']} >
                    <TextInput
                        style={styles.input}
                        placeholder="멤버 별명 입력"
                        keyboardType="default"
                        value={active['name']}
                        onChangeText={(text) => {
                            const newInputs = actives.map(item =>
                                item.id === active['id'] ? { ...item, name: text } : item);
                            setActives(newInputs);
                        }}
                    />
                    {active['active'] ? (
                        <TouchableOpacity onPress={() => toggleActive(active['id'])} style={styles.activeButton}>
                            <Text style={styles.activeText}> 활성 </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => toggleActive(active['id'])} style={styles.inActiveButton}>
                            <Text style={styles.inActiveText}> 비활성 </Text>
                        </TouchableOpacity>
                    )}
                </View>
            ))}
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
    activeButton: {
        position: 'absolute',
        right: 12,
        top: 18,
        height: 25,
        width: 60,
        borderRadius: 5,
        borderColor: '#5DAF6A',
        borderWidth: 1,
        backgroundColor: 'rgba(93,175,106,0.2)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    activeText: {
        fontSize: 14,
        color: '#5DAF6A'
    },
    inActiveButton: {
        position: 'absolute',
        right: 12,
        top: 18,
        height: 25,
        width: 60,
        borderRadius: 5,
        borderColor: '#6C6C6C',
        borderWidth: 1,
        backgroundColor: 'rgba(108,108,108,0.2)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inActiveText: {
        fontSize: 14,
        color: '#6C6C6C'
    },
});

export default UpdateMember;
