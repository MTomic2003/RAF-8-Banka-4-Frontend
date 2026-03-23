import { bankingApi } from '../client';

export const exchangeApi = {
    getRates: () => bankingApi.get('/exchange/rates'),
    calculate: (params) => bankingApi.get('/exchange/calculate', { params }),
};
