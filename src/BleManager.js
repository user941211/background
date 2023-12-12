import { BleManager } from 'react-native-ble-plx';
import axios from 'axios';

const manager = new BleManager();

export const startDeviceScan = (manager, setDevices) => {
    // 모든 BLE 장치를 스캔
    manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            console.log(error);
            return;
        }

        if (device.advertisementData) {
            console.log(`Advertisement Data: ${device.advertisementData}`);
        }

        setDevices(prevDevices => {
            const deviceIndex = prevDevices.findIndex(d => d.localName === device.localName);
            if (deviceIndex >= 0) {
                return [...prevDevices.slice(0, deviceIndex), device, ...prevDevices.slice(deviceIndex + 1)];
            } else {
                return [...prevDevices, device];
            }
        });
    });
};



export const handleDeviceSelect = async (manager, device, setDevices) => {
    manager.stopDeviceScan();

    try {
        // 연결 시도
        const connectedDevice = await device.connect();
        console.log(`Connected to ${connectedDevice.localName}`);
        await connectedDevice.discoverAllServicesAndCharacteristics();

        // 연결 성공 시 장치 정보 저장
        setDevices([connectedDevice]);

        // 연결 해제 이벤트 리스너 설정
        connectedDevice.onDisconnected((error, disconnectedDevice) => {
            console.log(`Disconnected from ${disconnectedDevice.localName}`);
        });


        // 특정 서비스의 특정 특성 읽기
        const serviceUUID = '00001101-0000-1000-8000-00805f9b34fb';
        const characteristicUUID = '00002101-0000-1000-8000-00805f9b34fb';
        const characteristic = await manager.readCharacteristicForDevice(connectedDevice.id, serviceUUID, characteristicUUID);

        // 읽은 데이터를 서버로 전송
        const data = characteristic.value;
        await axios.post('https://port-0-pbl-server-57lz2alpkmmh4z.sel4.cloudtype.app/upload', {
            audioFile: data // Replace with your actual data key and value
        });
    } catch (error) {
        // 연결 실패 시 에러 메시지 출력
        console.log(`Failed to connect with ${device.name}: ${error}`);
        setMessage('연결에 실패했습니다. 장치를 다시 선택해 주세요.');
    }
};
// export const handleDeviceSelect = (manager, device, setDevices) => {
//     if (device) {
//         console.log('선택한 장치의 이름:', device.localName);
//     }

//     manager.stopDeviceScan();
//     setDevices([]);
// };