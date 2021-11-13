import { Rx } from '@constants/index';
import { CommonHelpers } from '@helpers/index';
import Middlewares from '@middlewares/index';
import { RxUtil } from '@utils/index';

const rxFetchListBankAsync = async () => {
    const result = await RxUtil(
        Rx.BANK.GET_LIST_BANK,
        'GET'
    );
    return result;
};

const fetchListBankAsync = async () => {
    let result = await rxFetchListBankAsync();

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchListBankAsync();
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitAddBankAccountAsync = async (body) => {
    const result = await RxUtil(
        Rx.BANK.ADD_UPDATE_BANK_ACCOUNT,
        'POST',
        body
    );
    return result;
};

const submitAddBankAccountAsync = async (body) => {
    let result = await rxSubmitAddBankAccountAsync(body);
    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitAddBankAccountAsync(body);
    }
    return CommonHelpers.handleResByStatus(result);
};

export default {
    fetchListBankAsync,
    submitAddBankAccountAsync,
};
