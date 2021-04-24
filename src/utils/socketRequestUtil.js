/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { SOCKET_URL } from '@env';
import axios from 'axios';

export default (
    method,
    data,
    token,
    successCallBack = null,
    failCallBack = null,
    catchCallBack = null
) => {
    const config = {
        method,
        url: `https:${SOCKET_URL}`,
        headers: {
            Authorization: token,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
    };

    const graphQueryString = data.query;
    const callingType = graphQueryString.split(' ')[0];
    const actionName = graphQueryString.split(' ')[1].split('(')[0];
    const infoString = `${callingType} ${actionName}`;

    axios(config)
        .then((response) => {
            if (response.status === 200) {
                if (successCallBack) successCallBack(response);
            } else {
                if (failCallBack) failCallBack(response);
                console.log('fail error :>> ', response);
            }
            console.log(`${response.status} socket ${infoString}`, config);
        })
        .catch((error) => {
            const { response } = error;
            if (catchCallBack) catchCallBack(response);
            console.log('catch error :>> ', response);
        });
};
