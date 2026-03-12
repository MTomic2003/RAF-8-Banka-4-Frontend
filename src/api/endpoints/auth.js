import api from '../client';

export const authApi = {
  login:          (data)  => api.post('/login', data),
  register:       (data)  => api.post('/register', data),
  activate:       (data)  => api.post('/activate', data),
  forgotPassword: (email) => api.post('/forgot-password', { email }),
  resetPassword:  (data)  => api.post('/reset-password', data),
  refresh:        (refreshToken) => api.post('/refresh', { refresh_token: refreshToken }),
};
