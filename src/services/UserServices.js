/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { Rx } from '../constants';
import RxUtil from '../utils/Rx.Util';

const loginAsync = async (body) => {
    const result = await RxUtil(
        Rx.AUTHENTICATION.LOGIN,
        'POST',
        body
    );

    const {
        status,
        data
    } = result;

    console.log('result :>> ', result);

    if (status === 200 || status === 201) {
        return {
            isSuccess: true,
            data,
            status
        };
    }

    return {
        isSuccess: false,
        data,
        status
    };
};

export default {
    loginAsync,
};
