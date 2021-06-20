/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { Rx } from '@constants/index';
import { API_URL } from '@env';
import { ToastHelpers } from '@helpers/index';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import slackUtil from './slackUtil';

const generateLogData = (endpoint, body, headers, res) => {
    const objectStr = JSON.stringify({
        headers,
        body,
        res
    });

    logMessage(res, endpoint, headers, body);

    return `${res.status} ${endpoint}:\n ${objectStr}`;
};

const logMessage = (res, endpoint, headers, body) => {
    console.log(`${res.status} ${endpoint}`, {
        headers,
        body,
        res
    });
};

export default async (
    endpoint,
    method,
    body = null,
    domain = API_URL
) => {
    const apiTokenLocal = await SecureStore.getItemAsync('api_token');
    const url = `${domain}${endpoint}`;

    let headers = {};
    if (endpoint !== Rx.AUTHENTICATION.LOGIN) {
        headers = {
            Authorization: apiTokenLocal
        };
    }

    try {
        const res = await axios({
            url,
            data: body,
            method,
            headers
        });

        logMessage(res, endpoint, headers, body);

        return res;
    } catch (err) {
        const {
            response, response: { data }
        } = err;

        const logInfo = generateLogData(endpoint, data, headers, response);
        slackUtil('catch', logInfo);

        // check token expired
        if (!response.headers?.tokenexpired) {
            ToastHelpers.renderToast(data?.message || null);
        }

        return response;
    }
};
