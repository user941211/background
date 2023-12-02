import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';

class PermissionManager {
  async checkPermissions() {
    const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (result === RESULTS.DENIED) {
      await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
  }
}

export default new PermissionManager();
