import axiosInstance from './axios';
import { message } from 'antd';
import { dealError } from './util';

const getAxiosRequest = (method: string) => {
  const that = this;
  return (url, params, config = {}) => {
    return new Promise((resolve, reject) => {
      let axiosParams = [url];
      if (method === 'get') {
        axiosParams.push({
          ...config,
          params,
        });
      } else {
        if (params) axiosParams.push(params);
        if (config) axiosParams.push(config);
      }
      axiosInstance[method]
        .apply(that, axiosParams)
        .then((response) => {
          const { code, result, message: errorMessage } = response;
          if (code === 200) {
            resolve(result);
          } else {
            message.error({ content: errorMessage || '网络异常' });
            reject(errorMessage);
            dealError(errorMessage);
          }
        })
        .catch((error) => {
          reject(error);
          dealError(error);
        });
    });
  };
};

export default {
  get: getAxiosRequest('get'),
  post: getAxiosRequest('post'),
};
