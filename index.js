import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Alert, FlatList, TouchableOpacity, Text, AppRegistry, StyleSheet } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { checkLocationPermissions } from './src/Permissions';
import sendDataToServer from './src/ServerCommunicator';
import { startDeviceScan, handleDeviceSelect } from './src/BleManager';

const App = () => {
    const [uuid, setUuid] = useState('');
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [message, setMessage] = useState('');
    const [serverResponse, setServerResponse] = useState(null);
    const [updateTitle, setUpdateTitle] = useState("업데이트");

    const manager = new BleManager();
    const timeoutRef = useRef(null);

    useEffect(() => {
        checkLocationPermissions();
    }, []);

    const handleUpdate = () => {
        setUpdateTitle("업데이트 중...");

        setTimeout(() => {
            //Alert.alert("업데이트 알림", "업데이트가 완료되었습니다!!");
            Alert.alert("업데이트 알림", "최신버전입니다!");
            setUpdateTitle("업데이트");
        }, 3000);
    };

    const handleButtonClickWithPermissionRequest = () => {
        setMessage('장치 찾는 중...');
        startDeviceScan(manager, setDevices);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setMessage('장치 찾기 완료');
        }, 20000);
    };

    useEffect(() => {
        const url = 'https://port-0-pbl-server-57lz2alpkmmh4z.sel4.cloudtype.app/checks';
        console.log(url + '연결시도 중')
        const fetchData = async () => {
            const response = await sendDataToServer(url);
            setServerResponse(response);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedDevice) {
            const device = devices.find(device => device.id === selectedDevice);
            handleDeviceSelect(manager, device, setDevices, handleButtonClickWithPermissionRequest);
        }
    }, [selectedDevice]);

    return (
        <View style={styles.container}>
            {selectedDevice ?
                <Button style={styles.button} onPress={() => setSelectedDevice(null)} title="초기화" /> :
                <Button style={styles.button} onPress={handleButtonClickWithPermissionRequest} title="기기 찾기" />
            }
            <Text style={styles.text}>{message}</Text>
            <Text style={styles.text}>{serverResponse ? serverResponse : 'Loading...'}</Text>
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>{updateTitle}</Text>
            </TouchableOpacity>
            <FlatList
                data={devices}
                keyExtractor={item => item.localName}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleDeviceSelect(manager, item, setDevices)}>
                        <View style={styles.listItemContainer}>
                            <Text style={styles.listItemText}>{item.localName}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    input: {
        height: 40,
        borderColor: '#888',
        borderWidth: 1,
        width: '100%',
        marginBottom: 10,
        borderRadius: 5,
    },
    button: {
        width: '60%', // 버튼의 너비를 키웠습니다.
        height: 50, // 버튼의 높이를 키웠습니다.
        margin: 20,
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center',
    },
    text: {
        margin: 10,
        color: '#333',
    },
    listItemContainer: {
        padding: 10,
        margin: 5,
        borderColor: '#3498db',
        borderWidth: 1,
        borderRadius: 5,
    },
    listItemText: {
        fontSize: 16,
        color: '#333',
    },
});

AppRegistry.registerComponent('background', () => App);