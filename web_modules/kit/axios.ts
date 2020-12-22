import axios from 'axios';
import { message } from 'antd';
import { tryGet, microAppHistory } from 'kit';

const axiosInstance: any = axios.create();

axiosInstance.__isSetted__ = false;
axiosInstance.setAxiosConfig = (config, TOKEN_KEY) => {
  if (axiosInstance.__isSetted__) return;
  axiosInstance.__isSetted__ = true;
  /* axios公共配置 */
  axiosInstance.defaults.baseURL = config.BASE_URL; //请求baseUrl
  // 表示跨域请求时是否需要使用凭证,也可自动把后台set的cookie存起来
  axiosInstance.defaults.withCredentials = false;
  axiosInstance.defaults.timeout = tryGet(config, 'AJAX_TIMEOUT') || 60000; //设置超时时间
  axiosInstance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  axiosInstance.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded';

  //request拦截器
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    //只有当token存在并且请求头未做配置
    if (token && !tryGet(config.headers, 'Authorization')) {
      config.headers = {
        'Content-type': 'application/json;charset=utf-8',
        token: token,
      };
    } else if (
      tryGet(config.headers, 'token') &&
      tryGet(config.headers, 'token') !== 'none'
    ) {
      config.headers = {
        ...config.headers,
      };
    } else {
      config.headers = {
        'Content-type': 'application/json;charset=utf-8',
      };
    }
    return config;
  });

  //response拦截器
  axiosInstance.interceptors.response.use(
    (response) => {
      const { data } = response;
      const { status, code } = data;
      if (status === 401 || code === 401 || status === 1003 || code === 1003) {
        localStorage.removeItem(TOKEN_KEY);
        microAppHistory.push('/login');
        return message.error(data.message ? data.message : '登录已过期');
      }

      const { authorization } = response.headers;
      authorization && localStorage.setItem(TOKEN_KEY, authorization);
      return response.data ? response.data : response;
    },
    (error) => {
      if (error.response) {
        const { status, code, data } = error.response;
        if (status === 401 || status === 405 || code === 401 || code === 405) {
          localStorage.removeItem(TOKEN_KEY);
          microAppHistory.push('/login');
          message.error(data.message ? data.message : '请求超时');
        } else if (status === 422 || code === 422) {
          message.error(data.message);
        }
      }
      return Promise.reject(
        error.response && error.response.data ? error.response.data : error
      );
    }
  );
};

export default axiosInstance;
