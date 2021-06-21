/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { Rx } from '@constants/index';
import { API_URL } from '@env';
import ToastHelpers from '@helpers/ToastHelpers';
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
    domain = API_URL,
    headers = {}
) => {
    const apiTokenLocal = await SecureStore.getItemAsync('api_token');
    const url = `${domain}${endpoint}`;

    if (endpoint !== Rx.AUTHENTICATION.LOGIN) {
        // eslint-disable-next-line no-param-reassign
        headers = {
            Authorization: apiTokenLocal

            // eslint-disable-next-line max-len
            // Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6Imh1eXZkIiwidXNlcklkIjoiOTBiNjQxMjktY2UwMS00ZWQ1LTg3YTEtZTQzYWUxZDMwNGJkIiwiZnVsbE5hbWUiOiJodXkgxJHhurlwIHRyYWkiLCJkZXNjcmlwdGlvbiI6Im5ow6Aga28gY8OzIGfDrCBuZ2_DoGkgxJFp4buBdSBraeG7h24iLCJhZGRyZXNzIjoiMDEgaGFvbmcgZGlldSAyIHF1YW4gdGh1IGR1YyIsInVybCI6Imh0dHBzOi8vem5ld3MtcGhvdG8uemFkbi52bi93NjYwL1VwbG9hZGVkL2NxeHJjYWp3cC8yMDEzXzEwXzA3L2NhbmguanBnIiwidXNlclR5cGUiOiJDdXN0b21lciIsImlzVGVzdCI6IkZhbHNlIiwiaXNMb2NrZWQiOiJGYWxzZSIsImV4cCI6MTYyMzkzNjU3N30.w1UW5WoK0a2dU6jUuoUe5Ik_x3t1_EIEp5ij_12kIPI'
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
            ToastHelpers.renderToast(data.message || null);
        }

        return response;
    }
};
