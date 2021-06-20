/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { API_URL } from '@env';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Rx } from '../constants';
import { ToastHelpers } from '../helpers';
import slackUtil from './slackUtil';

const generateLogData = (endpoint, data, headers, res) => {
    const objectStr = JSON.stringify({
        headers,
        data,
        res
    });

    return `${res.status} ${endpoint}:\n ${objectStr}`;
};

export default async (
    endpoint,
    method,
    body,
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

        return res;
    } catch (err) {
        const {
            response, response: { data }
        } = err;

        const logInfo = generateLogData(endpoint, data, headers, response);
        slackUtil('catch', logInfo);

        console.log(`${response.status} ${endpoint}`, {
            headers,
            data,
            response
        });

        // check token expired
        if (!response.headers?.tokenexpired) {
            ToastHelpers.renderToast(data?.message || null);
        }

        return response;
    }
};
