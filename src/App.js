import React, { Component } from 'react';
import { View, Text } from 'react-native';
import BleManager from './blemanager';
import PermissionManager from './permissionmanager';

export default class App extends Component {
  componentDidMount() {
    PermissionManager.checkPermissions();
    BleManager.scanAndConnect();
  }

  render() {
    return (
      <View>
        <Text>BLE 연결 테스트</Text>
      </View>
    );
  }
}
