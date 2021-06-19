const generateMoneyStr = (moneyText) => `${numberWithCommas(moneyText.toString())}`;

const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export default {
    generateMoneyStr,
    numberWithCommas
};
