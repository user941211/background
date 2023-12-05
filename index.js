import React, { useState, useEffect, useRef } from 'react';
import { View, Button, TextInput, Text, AppRegistry, StyleSheet } from 'react-native';
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

    const manager = new BleManager();
    const timeoutRef = useRef(null);

    
    useEffect(() => {
        checkLocationPermissions();
    }, []);

    const handleButtonClickWithPermissionRequest = () => {
        //uuid는 16진수로 작성되어야 한다.
        setMessage(`${uuid} 찾는 중...`);
        startDeviceScan(manager, setDevices, uuid);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // 20초 후에 메시지 변경 및 재검색
        timeoutRef.current = setTimeout(() => {
            setMessage('연결에 실패했습니다. 다시 찾기 버튼을 누르십시오');

            // devices 배열에서 첫 번째 장치를 선택
            const device = devices[0];

            // 선택한 장치가 존재하면 연결 시도
            if (device) {
                handleDeviceSelect(manager, device, setDevices, setMacAddress, setMessage, handleButtonClickWithPermissionRequest);
            }
        }, 20000);
    };

    useEffect(() => {
        const url = 'https://port-0-pbl-server-57lz2alpkmmh4z.sel4.cloudtype.app/checks';
        console.log(url + '연결시도 중')
        const fetchData = async () => {
            //const url = 'port-0-pbl-server-57lz2alpkmmh4z.sel4.cloudtype.app/checks'; // 요청 URL
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
            <TextInput
                style={styles.input}
                onChangeText={text => setUuid(text)}
                value={uuid}
            />
            <Button onPress={handleButtonClickWithPermissionRequest} title="기기 찾기" />
            <Text>{message}</Text>
            <Text>{serverResponse ? serverResponse : 'Loading...'}</Text>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: '100%',
        marginBottom: 10,
    },
});
AppRegistry.registerComponent('background', () => App);
