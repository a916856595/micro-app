import axios from 'axios';

/**
 * 用户登出
 */
export const logout = () => axios.post('/logout');
