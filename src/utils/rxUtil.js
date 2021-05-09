/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { API_URL } from '@env';
import axios from 'axios';
import ToastHelpers from '../helpers/ToastHelpers';

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
            if (res.status === 200 || res.status === 201) {
                generateLogData(endpoint, data, headers, res);
                if (successCallBack) successCallBack(res);
            } else {
                generateLogData(endpoint, data, headers, res);
                if (failCallBack) failCallBack(res);
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
            console.log('catch', response);
            generateLogData(endpoint, data, headers, response);

            if (message && message !== '') {
                ToastHelpers.renderToast(message, 'error');
            } else {
                ToastHelpers.renderToast();
            }

            if (catchCallBack) catchCallBack(response);
        });
};
