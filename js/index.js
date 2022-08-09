// require('dotenv').config();
// const axios = require('axios').default;
import 'dotenv/config';
import axios from 'axios';

//get exchange rate
const getExchangeRate = async (fromCurrency, toCurrency) => {
    //get response object and asigned it to rObj
    const rObj = await axios.get('https://api.currencyscoop.com/v1/latest?api_key=' + process.env.CURRENCY_API_KEY);
    const rate = rObj.data.response.rates;
    const usd = 1 / rate[fromCurrency];
    const exchangeRate = usd * rate[toCurrency];

    if(isNaN(exchangeRate)) {
        throw new Error (`Unable to get currency ${fromCurrency} and / or ${toCurrency}.`);
    }

    return exchangeRate;
}

//get countries
const getCountries = async (toCurrency) => {
    try{
        const rObj = await axios.get('https://api.currencyscoop.com/v1/currencies?api_key=' + process.env.CURRENCY_API_KEY);
        const countries = rObj.data.response.fiats[toCurrency].countries;
        return countries.map(country => country);
    } catch(err) {
        throw new Error(`Unable to get countries that use ${toCurrency}`);
    }
}

//convert currency
const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    const countries = await getCountries(toCurrency);
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = (amount * exchangeRate).toFixed(2);

    return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spend these in the following countries; ${countries}.`
}

//call convertCurrency to get meaningful data.
convertCurrency('USD', 'CAD', 30)
    .then((message) => console.log(message))
    .catch((err) => console.log(err));