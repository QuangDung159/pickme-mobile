import BookingStatus from '@constants/BookingStatus';
import moment from 'moment';

const generateMoneyStr = (moneyText) => `${formatNumberWithSeparator(moneyText.toString().trim())}`;

const formatNumberWithSeparator = (x, separator = '.') => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);

const formatCurrencyUnit = (x) => {
    let strReverts = x.toString().split('').reverse().join('');
    strReverts = strReverts.replace('000000', 'm');
    strReverts = strReverts.replace('000', 'k');
    const result = strReverts.split('').reverse().join('');
    return result;
};

const formatCurrency = (number = 0, separator = '.', hasCurrencyText = false) => {
    if (hasCurrencyText) {
        return formatCurrencyUnit(number);
    }

    return formatNumberWithSeparator(number?.toString().trim(), separator);
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

// 2021-12-08T21:26:26.61144
export const formatTime = (timeString, format = 'HH:mm:ss DD-MM-YYYY') => {
    const timestamp = new Date(timeString);
    return moment(timestamp).format(format);
};

export default {
    generateMoneyStr,
    formatNumberWithSeparator,
    handleResByStatus,
    formatCurrencyUnit,
    formatCurrency,
    formatTime
};
