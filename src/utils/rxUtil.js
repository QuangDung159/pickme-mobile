/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { API_URL } from '@env';
import axios from 'axios';

const generateLogData = (endpoint, method, data, headers, res) => {
    console.log(`---- ${method} ${endpoint}`);
    console.log('headers', headers);
    console.log('data', data);
    console.log('res', res);
};

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
    generateLogData(endpoint, method, data, headers);
    axios({
        url,
        data,
        method,
        headers
    })
        .then((res) => {
            if (res.status === 200) {
                generateLogData(endpoint, method, data, headers, res);
                successCallBack(res);
            } else {
                failCallBack(res);
                generateLogData(endpoint, method, data, headers, res);
            }
        })
        .catch((err) => {
            const {
                response,
                response: {
                    data: {
                        message
                    }
                }
            } = err;
            console.log('catch error :>> ', response);
            generateLogData(endpoint, method, data, headers, response);
            catchCallBack(message);
        });
};
