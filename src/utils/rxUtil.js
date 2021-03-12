/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { API_URL } from '@env';
import axios from 'axios';

const generateLogData = (endpoint, data, headers, res) => {
    console.log(`${res.status} ${endpoint}`, {
        headers,
        data,
        res
    });
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
    axios({
        url,
        data,
        method,
        headers
    })
        .then((res) => {
            if (res.status === 200) {
                generateLogData(endpoint, data, headers, res);
                successCallBack(res);
            } else {
                generateLogData(endpoint, data, headers, res);
                failCallBack(res);
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
            console.log('response', response);
            generateLogData(endpoint, method, data, headers, response);
            catchCallBack(message);
        });
};
