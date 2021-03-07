/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { API_URL } from '@env';
import axios from 'axios';

export default (
    endpoint,
    method,
    data,
    headers,
    successCallBack = null,
    failCallBack = null,
    catchCallBack = null
) => {
    const url = `${API_URL}${endpoint}`;
    axios({
        url,
        data,
        method,
        headers
    })
        .then((res) => {
            console.log(`${method} ${res.status} ${endpoint}`);
            if (res.status === 200) {
                successCallBack(res);
            } else {
                failCallBack(res);
                console.log('fail error :>> ', res);
            }
        })
        .catch((err) => {
            const {
                response,
                response: {
                    status,
                    data: {
                        message
                    }
                }
            } = err;
            console.log('catch error :>> ', response);
            console.log(`${method} ${status} ${endpoint}`);
            catchCallBack(message);
        });
};
