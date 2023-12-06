import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

export const startDeviceScan = (manager, setDevices, uuid) => {
    console.log(uuid)
    const fullUuid = `0000${uuid}-0000-1000-8000-00805f9b34fb`;
    
    //serviceUUID,characteristicUUID는 고정 UUID로 사용 예정, 추후 변경
    manager.startDeviceScan([fullUuid], null, (error, device) => {
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
};


export const handleDeviceSelect = (manager, device, _setDevices, setMacAddress, handleButtonClickWithPermissionRequest) => {
    manager.stopDeviceScan();
    device.connect()
        .then((d) => {
            console.log(`Connected to ${d.name}`);
            setMacAddress(d.id); // Save MAC address of connected device
            setMessage(`${d.name}에 연결되었습니다.`);

            d.onDisconnected((error, disconnectedDevice) => {
                console.log(`Disconnected from ${disconnectedDevice.name}`);
                setMessage('연결이 끊어졌습니다. 재연결을 시도합니다.');
                handleButtonClickWithPermissionRequest(); // 연결 해제 시 재연결 로직 실행
            });// 연결 해제 이벤트 리스너 설정

            return d.discoverAllServicesAndCharacteristics();
            
        })
        .then((d) => {
            const serviceUUID = '00001234-0000-1000-8000-00805f9b34fb';
            const characteristicUUID = '00005678-0000-1000-8000-00805f9b34fb';
            return manager.readCharacteristicForDevice(device.id, serviceUUID, characteristicUUID);
        })
        .then((characteristic) => {
            const data = characteristic.value; // 아두이노에서 받은 데이터
            // 이제 이 데이터를 서버로 보낼 수 있습니다
            return axios.post('https://port-0-pbl-server-57lz2alpkmmh4z.sel4.cloudtype.app/upload', {
                audioFile: data // Replace with your actual data key and value
            });
        })
        .catch((error) => {
            console.log(`Failed to connect with ${device.name}: ${error}`);
            setMessage('연결에 실패했습니다. 다시 연결을 시도합니다.');
            handleButtonClickWithPermissionRequest(); // 연결 실패 시 재연결 로직 실행
        });
};

