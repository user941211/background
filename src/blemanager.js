import { BleManager as Manager } from 'react-native-ble-plx';

class BleManager {
  constructor() {
    this.manager = new Manager();
  }

  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        return;
      }

      if (device.name === 'MyDevice') {
        device.connect()
          .then((device) => {
            return device.discoverAllServicesAndCharacteristics()
          })
          .then((device) => {
           this.readAndSendData(device);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }

  readAndSendData(device) {
    device.services()
      .then(services => {
        return services[0].characteristics();
      })
      .then(characteristics => {
        return characteristics[0].read();
      })
      .then(characteristic => {
        let data = characteristic.value;
        fetch('https://my-server.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({data}),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

export default new BleManager();
