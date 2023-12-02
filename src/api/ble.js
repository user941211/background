import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

export const handleButtonClick = (setDevices) => {
  const devicesFound = [];

  manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
          console.log(error);
          return;
      }

      devicesFound.push(device);
      setDevices(devicesFound);
  });
}

export const handleDeviceSelect = (device) => {
  manager.stopDeviceScan();

  device.connect()
      .then((device) => {
          return device.discoverAllServicesAndCharacteristics()
      })
      .then((device) => {
         return device.readCharacteristicForService('service_uuid', 'characteristic_uuid');
      })
      .then((characteristic) => {
          console.log(characteristic.value);
          sendDataToServer(characteristic.value);
      })
      .catch((error) => {
          console.error(error);
      });
}

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
}
