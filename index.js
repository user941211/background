/**
 * @format
 */

// import {AppRegistry} from 'react-native';
// import App from './src/App';
// //import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);
import React, { useState, useEffect } from 'react';
import { View, AppRegistry } from 'react-native';
import Button from './src/components/Button';
import Dropdown from './src/components/Dropdown';
import { handleButtonClick, handleDeviceSelect } from './src/api/ble';
import { request, PERMISSIONS } from 'react-native-permissions';

const App = () => {
    const [devices, setDevices] = useState([]);
    useEffect(() => {
        request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
            .then((result) => {
                if (result === 'granted') {
                    // 위치 권한이 승인되었을 때의 처리
                    console.log("위치 권한 승인");

                    // 백그라운드 위치 권한 요청
                    request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION)
                        .then((result) => {
                            if (result === 'granted') {
                                // 백그라운드 위치 권한이 승인되었을 때의 처리
                                console.log("위험한 권한 승인");
                            } else {
                                // 백그라운드 위치 권한이 거부되었을 때의 처리
                                console.log("위험한 권한 거부");
                            }
                        });

                    request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN)
                        .then((result) => {
                            if (result === 'granted') {
                                // 블루투스 권한이 승인되었을 때의 처리
                                console.log("블루투스 권한 승인");
                            } else {
                                // 블루투스 권한이 거부되었을 때의 처리
                                console.log("블루투스 권한 거부");
                            }
                        });
                } else {
                    // 위치 권한이 거부되었을 때의 처리
                    console.log("위치 권한 거부");
                }
            });
    }, []);


    return (
        <View>
            <Button onPress={() => handleButtonClick(setDevices)} />
            <Dropdown devices={devices} onSelect={handleDeviceSelect} />
        </View>
    );
};

AppRegistry.registerComponent('background', () => App);