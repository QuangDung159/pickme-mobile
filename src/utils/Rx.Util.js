/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { API_URL } from '@env';
import axios from 'axios';
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
    headers,
    domain = API_URL
) => {
    const url = `${domain}${endpoint}`;
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
