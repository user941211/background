import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';

useEffect(() => {
    Promise.all([
        check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION),
        check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION),
        check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION)
    ])
        .then(([fineLocationResult, coarseLocationResult]) => {
            if (fineLocationResult === RESULTS.DENIED) {
                request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => { });
            }

            if (coarseLocationResult === RESULTS.DENIED) {
                request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then((result) => { });
            }
        })
        .catch((error) => {
            console.log('Permission check error:', error);
        });
}, []);