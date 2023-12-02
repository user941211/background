import BackgroundFetch from "react-native-background-fetch";
import BleManager from './blemanager';

let MyHeadlessTask = async (event) => {
  // 여기에 장치와의 연결을 유지하고, 데이터를 읽어서 서버에 전송하는 코드를 작성합니다.
  BleManager.scanAndConnect();
  
  BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
}

BackgroundFetch.configure({
  minimumFetchInterval: 15,
  enableHeadless: true,
  stopOnTerminate: false,
  startOnBoot: true,
}, (taskId) => {
  console.log("[js] Received background-fetch event: ", taskId);
  BackgroundFetch.finish(taskId);
}, (error) => {
  console.log("[js] RNBackgroundFetch failed to start");
});

BackgroundFetch.registerHeadlessTask(MyHeadlessTask);
