import BookingStatus from '@constants/BookingStatus';

const generateMoneyStr = (moneyText) => `${numberWithCommas(moneyText.toString().trim())}`;

const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const formatCurrency = (x) => {
    let strReverts = x.toString().split('').reverse().join('');
    strReverts = strReverts.replace('000000', 'm');
    strReverts = strReverts.replace('000', 'k');
    const result = strReverts.split('').reverse().join('');
    return result;
};

const handleResByStatus = (response) => {
    const {
        status,
        data
    } = response;

    if (status === 200 || status === 201) {
        return {
            data,
            status
        };
    }

    return {
        data: null,
        status
    };
};

export const mappingStatusText = (status) => {
    switch (status) {
        case BookingStatus.SCHEDULING:
            return 'Chờ xác nhận';
        case BookingStatus.PAID: return 'Đã được thanh toán';
        case BookingStatus.IS_CONFIRMED: return 'Đã được xác nhận';
        case BookingStatus.COMPLETED: return 'Buổi hẹn hoàn tất';
        default:
            return 'Đã huỷ';
    }
};

export default {
    generateMoneyStr,
    numberWithCommas,
    handleResByStatus,
    formatCurrency,
};
