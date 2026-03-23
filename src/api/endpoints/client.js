import { bankingApi } from '../client';

export const clientApi = {
  getAccounts: (clientId) => bankingApi.get(`/clients/${clientId}/accounts`),

  // Payees
  getPayees:    ()          => bankingApi.get('/payees'),
  createPayee:  (data)      => bankingApi.post('/payees', data),
  updatePayee:  (id, data)  => bankingApi.patch(`/payees/${id}`, data),
  deletePayee:  (id)        => bankingApi.delete(`/payees/${id}`),
};
