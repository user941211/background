import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <Text style={styles.text}>기기 찾기</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4ECDC4',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        margin: 10,
    },
    text: {
        color: 'black',
        fontSize: 30,
    },
});

export default Button;
