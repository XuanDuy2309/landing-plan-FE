import moment from 'moment';

export const dateRangeConfig = () => {
  const minDate = moment().subtract(6, 'months').format('YYYYMMDD');
  const maxDate = moment().add(6, 'months').format('YYYYMMDD');
  return { minDate, maxDate };
};

export const currencyFormat = (value) => {
  let amount = JSON.parse(JSON.stringify(String(value)));
  let newAmount;
  if (!amount) return '';
  // if (!isNaN(value) && value < 0) {
  //   return String(value).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
  // }
  if (typeof amount === 'string' && amount.includes('.')) {
    const stringRemoved: any = amount.replace(/\./g, '');
    newAmount = String(Math.round(stringRemoved)).replace(/\D+/g, '');
  } else newAmount = String(Math.round(amount)).replace(/\D+/g, '');
  return String(newAmount).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
};

export const currencyFormatRound = (currency) => {
  return currencyFormat(Math.round(Number(currency)))
}

export const currencyFormatToInt = (currency): number => {
  if (!currency) return Number(0);
  if (typeof currency === 'string' && currency.includes('.')) {
    const strgCurrency = currency.replace(/\./g, '');
    return Number(strgCurrency);
  }
  return Number(currency);
};

export const convertToInt = (x, base) => {
  const parsed = Number.parseInt(x, base);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return parsed;
};

export const unitPriceToPrice = (price, unitPrice) => {
  if (!price) return null;
  if (price.length > unitPrice) return null;
  const priceBind = unitPrice - price.length;
  return price + '0'.repeat(priceBind);
};

export const parthUrl = (parth) => `https://img.homedy.com/${parth}`;

export const formatMoney = (number, digits = 1, local = 'en') => {
  if (number === 0) return "0";
  const si =
    local === 'vn'
      ? [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: ' nghìn' },
        { value: 1e6, symbol: ' triệu' },
        { value: 1e9, symbol: ' tỷ' },
        { value: 1e12, symbol: 'T' },
        { value: 1e15, symbol: 'P' },
        { value: 1e18, symbol: 'E' },
        { value: 1e21, symbol: 'Z' },
        { value: 1e24, symbol: 'Y' },
      ]
      : [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: 'K' },
        { value: 1e6, symbol: 'M' },
        { value: 1e9, symbol: 'B' },
        { value: 1e12, symbol: 'T' },
        { value: 1e15, symbol: 'P' },
        { value: 1e18, symbol: 'E' },
        { value: 1e21, symbol: 'Z' },
        { value: 1e24, symbol: 'Y' },
      ];
  let isNegative = false;
  if (number < 0) {
     
    number = Math.abs(number);
    isNegative = true;
  }
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i -= 1) {
    if (number >= si[i].value) {
      break;
    }
  }
  return isNegative
    ? `(${(number / si[i].value).toFixed(digits).replace(rx, '$1')})${si[i].symbol
    }`
    : `${(number / si[i].value).toFixed(digits).replace(rx, '$1')}${si[i].symbol
    }`;
};
export const formatMobile = (string) => {
  if (string.trim().length === 10) {
    const phone = string.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
    console.debug('aaasdasdbvcascxasdc');
    console.debug(string);
    return phone;
  }
  return string;
};

export function priceFormatter(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num;
}


export function sizeTuple(bytes: number) {
  if (bytes > 1000 * 1000 * 1000) { //GB
    return Math.round(10 * bytes / (1000 * 1000 * 1000)) / 10 + 'GB';
  } else if (bytes > 1000 * 1000) { //MB
    return Math.round(10 * bytes / (1000 * 1000)) / 10 + 'MB';
  } else if (bytes > 1000) { //KB
    return Math.round(10 * bytes / 1000) / 10 + 'KB';
  } else if (bytes > 0) {
    return bytes + 'B';
  }
  return '-';
}

export function sliceText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
}