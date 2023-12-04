import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, AppRegistry } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import RNPickerSelect from 'react-native-picker-select';

const manager = new BleManager();

const App = () => {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [scanInterval, setScanInterval] = useState(null);
    useEffect(() => {
        Promise.all([
            check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION),
            check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION),
            check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION)
        ])
            .then(([fineLocationResult, coarseLocationResult, backgroundResult]) => {
                if (fineLocationResult === RESULTS.DENIED) {
                    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => { });
                }
                if (coarseLocationResult === RESULTS.DENIED) {
                    request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then((result) => { });
                }
                if (backgroundResult === RESULTS.DENIED) {
                    request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then((result) => { });
                }
            })
            .catch((error) => {
                console.log('Permission check error:', error);
            });
    }, []);

    const handleButtonClickWithPermissionRequest = () => {
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
                return;
            }

            setDevices(prevDevices => {
                const deviceIndex = prevDevices.findIndex(d => d.id === device.id);
                if (deviceIndex >= 0) {
                    return [...prevDevices.slice(0, deviceIndex), device, ...prevDevices.slice(deviceIndex + 1)];
                } else {
                    return [...prevDevices, device];
                }
            });
        });

        // 10초마다 검색을 중지하고 다시 시작
        setScanInterval(setInterval(() => {
            manager.stopDeviceScan();
            setDevices([]);
            manager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    console.log(error);
                    return;
                }

                setDevices(prevDevices => {
                    const deviceIndex = prevDevices.findIndex(d => d.id === device.id);
                    if (deviceIndex >= 0) {
                        return [...prevDevices.slice(0, deviceIndex), device, ...prevDevices.slice(deviceIndex + 1)];
                    } else {
                        return [...prevDevices, device];
                    }
                });
            });
        }, 10000));
    };

    const handleDeviceSelect = (deviceId) => {
        const device = devices.find(d => d.id === deviceId);
        manager.stopDeviceScan();

        device.connect()
            .then((device) => {
                return device.discoverAllServicesAndCharacteristics();
            })
            .then((device) => {
                return device.services();
            })
            .then((services) => {
                const readCharacteristicPromises = [];

                for (const service of services) {
                    const characteristics = device.characteristicsForService(service.uuid);
                    for (const characteristic of characteristics) {
                        const promise = device.readCharacteristicForService(service.uuid, characteristic.uuid);
                        readCharacteristicPromises.push(promise);
                    }
                }

                return Promise.all(readCharacteristicPromises);
            })
            .then((characteristics) => {
                for (const characteristic of characteristics) {
                    console.log(characteristic.value);
                    sendDataToServer(characteristic.value);
                }
            })
            .catch((error) => {
                //console.error(error);
                handleButtonClickWithPermissionRequest();
            });
    };

    const sendDataToServer = async (data) => {
        let response = await fetch('https://your_server.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: data
            })
        });
        let responseJson = await response.json();
        console.log('[BackgroundFetch] response: ', responseJson);
    };

    useEffect(() => {
        if (selectedDevice) {
            handleDeviceSelect(selectedDevice);
        }
    }, [selectedDevice]);

    useEffect(() => {
        return () => {
            // 컴포넌트가 언마운트될 때 검색을 중지하고 인터벌을 제거
            manager.stopDeviceScan();
            clearInterval(scanInterval);
        };
    }, [scanInterval]);

    return (
        <View>
            <Button onPress={handleButtonClickWithPermissionRequest} title="기기 찾기" />
            <RNPickerSelect
                onValueChange={(value) => setSelectedDevice(value)}
                items={devices.map(device => ({ label: device.name || 'Unknown Device', value: device.id }))}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        backgroundColor: "#4ECDC4",
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        margin: 10,
        verticalAlign: 'middle',
    },
    closeButton: {
        backgroundColor: "#2196F3",
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        marginTop: 15,
    },
    text: {
        color: "white",
        textAlign: "center"
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});

AppRegistry.registerComponent('background', () => App);
