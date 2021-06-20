import { Rx } from '@constants/index';
import { CommonHelpers } from '@helpers/index';
import RxUtil from '@utils/Rx.Util';

const submitBugReportAsync = async (body) => {
    const result = await RxUtil(
        Rx.SYSTEM.CREATE_BUG,
        'POST',
        body
    );
    return CommonHelpers.handleResByStatus(result);
};

export default {
    submitBugReportAsync
};
