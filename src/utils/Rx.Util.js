/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { Rx } from '@constants/index';
import { API_URL, PICKME_INFO_URL } from '@env';
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

    return `${res.status} ${endpoint}:\n ${objectStr}`;
};

const logMessage = (res, endpoint, headers, body) => {
    console.log(`${res.status} ${endpoint}`, {
        headers,
        body,
        response: res
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
            Authorization: `Bearer ${apiTokenLocal}`
        };
    }

    if (!apiTokenLocal
        && endpoint !== Rx.AUTHENTICATION.LOGIN
        && endpoint !== Rx.USER.GET_OTP_REGISTER
        && endpoint !== Rx.AUTHENTICATION.SIGN_UP
    ) {
        return {
            data: {
                data: null
            }
        };
    }

    try {
        const res = await axios({
            url,
            data: body,
            method,
            headers
        });

        const response = {
            config: res.config,
            data: res.data,
            headers: res.headers,
            request: res.request,
            status: res.data.status
        };

        // check domain
        if (domain === PICKME_INFO_URL) {
            response.status = res.status;
        }

        logMessage(response, endpoint, headers, body);

        if (response.status !== 200 && response.status !== 201) {
            // check token expired
            if (!response.headers?.tokenexpired) {
            // if does not have tokenexpired => do not toast
                ToastHelpers.renderToast(response.data.message || null);
            }
        }

        return response;
    } catch (err) {
        const {
            response, response: { data }
        } = err;

        logMessage(response, endpoint, headers, body);
        const logInfo = generateLogData(endpoint, data, headers, response);
        slackUtil('catch', logInfo);

        // check token expired
        if (!response.headers?.tokenexpired) {
            ToastHelpers.renderToast(data.message || null);
        }

        return response;
    }
};
