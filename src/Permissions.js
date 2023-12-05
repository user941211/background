import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';

export const checkLocationPermissions = () => {
    //비동기 작업을 위해 useEffect에서 Promise로 변경
    return Promise.all([
        check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION),
        check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION),
        check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION),
        //check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN)
        
    ])
        .then(([fineLocationResult, coarseLocationResult, backgroundResult]) => {
            if (fineLocationResult === RESULTS.DENIED) {
                return request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            }
            if (coarseLocationResult === RESULTS.DENIED) {
                return request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
            }
            if (backgroundResult === RESULTS.DENIED) {
                return request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
            }
        })
        .catch((error) => {
            console.log('Permission check error:', error);
        });
};
