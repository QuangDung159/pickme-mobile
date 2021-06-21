const generateMoneyStr = (moneyText) => `${numberWithCommas(moneyText.toString())}`;

const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

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
    handleResByStatus
};
