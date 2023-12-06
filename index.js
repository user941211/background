import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Alert, TextInput, Text, AppRegistry, StyleSheet } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { checkLocationPermissions } from './src/Permissions';
import sendDataToServer from './src/ServerCommunicator';
import { startDeviceScan, handleDeviceSelect } from './src/BleManager';

const serviceUUID = '00001679-0000-1000-8000-00805f9b34fb';
const characteristicUUID = '00002468-0000-1000-8000-00805f9b34fb';

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

    const isHexadecimal = (str) => {
        return /^(0x|0X)?[0-9A-Fa-f]{4}$/.test(str);
    }

    const handleButtonClickWithPermissionRequest = () => {
        //uuid는 16진수로 작성되어야 한다.
        setMessage(`${uuid} 찾는 중...`);
        startDeviceScan(manager, setDevices, uuid);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // 20초 후에 메시지 변경 및 재검색
        timeoutRef.current = setTimeout(() => {
            setMessage('')
            // Alert 출력
            Alert.alert(
                "연결 실패", // Alert 제목
                "연결에 실패했습니다. 다시 찾기 버튼을 누르십시오", // Alert 메시지
                [
                    { text: "OK", onPress: () => console.log("버튼 누름!!!") } // 버튼 클릭시 동작
                ],
                { cancelable: false } // 사용자가 화면 밖을 터치해도 Alert가 사라지지 않습니다.
            );

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
            {selectedDevice ?
                <Button onPress={() => setSelectedDevice(null)} title="초기화" /> :
                <Button onPress={() => { if (!isHexadecimal(selectedDevice)) {
                        Alert.alert("입력  오류", "16진수 4글자로 구성되어야 합니다.");
                    } else {handleButtonClickWithPermissionRequest()}
                }}
                title="기기 찾기" />
            }
            <Text>{'16진수 (0~9, 대문자 A부터 F)로 이루어진 4자리 문자열을'}</Text>
            <Text>{'입력하고 기기찾기 버튼을 눌러주세요'}</Text>
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
