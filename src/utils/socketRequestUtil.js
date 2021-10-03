/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import Theme from '@constants/Theme';
import { SOCKET_URL } from '@env';
import axios from 'axios';

const { COLORS } = Theme;

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
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data
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
                console.log('%c Fail error :>> ', `color: ${COLORS.ERROR}`, response);
            }
            console.log(`%c ${response.status} socket ${infoString}`, `color: ${COLORS.SUCCESS}`, config);
        })
        .catch((error) => {
            const { response } = error;
            if (catchCallBack) catchCallBack(response);
            console.log('%c catch error :>> ', `color: ${COLORS.ERROR}`, response);
        });
};
