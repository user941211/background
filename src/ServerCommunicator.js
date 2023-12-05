import axios from 'axios';

const sendDataToServer = async (url) => {
    try {
        let response = await axios.get(url, {
            headers: {
                'Content-type': 'application/json'
            }
        });

        console.log('서버쪽 체크')
        console.log('[BackgroundFetch] response: ', response.data);

        // 서버로부터 받은 응답을 반환
        return response.data;
    } catch (error) {
        console.error(error);
    }
};


export default sendDataToServer;


