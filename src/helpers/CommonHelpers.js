const generateMoneyStr = (moneyText) => `${numberWithCommas(moneyText.toString())}`;

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

export default {
    generateMoneyStr,
    numberWithCommas,
    handleResByStatus,
    formatCurrency,
};
