/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { API_URL } from '@env';
import axios from 'axios';
import slackUtil from './slackUtil';

const generateLogData = (endpoint, data, headers, res) => {
    const objectStr = JSON.stringify({
        headers,
        data,
        res
    });

    return `${res.status} ${endpoint}:\n ${objectStr}`;
};

export default (
    endpoint,
    method,
    data,
    headers,
    successCallBack = null,
    failCallBack = null,
    catchCallBack = null,
    domain = API_URL
) => {
    const url = `${domain}${endpoint}`;
    axios({
        url,
        data,
        method,
        headers
    })
        .then((res) => {
            if (res.status === 200 || res.status === 201) {
                console.log(`${res.status} ${endpoint}`, {
                    headers,
                    data,
                    res
                });

                if (successCallBack) successCallBack(res);
            } else {
                console.log(`${res.status} ${endpoint}`, {
                    headers,
                    data,
                    res
                });

                if (failCallBack) failCallBack(res);
                const logInfo = generateLogData(endpoint, data, headers, res);
                slackUtil('error', logInfo);
            }
        })
        .catch((err) => {
            const {
                response,
            } = err;

            console.log(`${response.status} ${endpoint}`, {
                headers,
                data,
                response
            });

            const logInfo = generateLogData(endpoint, data, headers, response);
            slackUtil('catch', logInfo);

            if (catchCallBack) catchCallBack(response);
        });
};
