const generateMoneyStr = (moneyText) => `${numberWithCommas(moneyText.toString().replace('000', ''))}k VND`;

const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export default {
    generateMoneyStr,
    numberWithCommas
};
