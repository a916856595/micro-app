import axios from 'axios';

interface IResult {
  res: any;
  err: any;
}
export default class EGFetch {
  static post(parm: any, config?: object): any {
    return new Promise((resolve) => {
      axios
        .post(parm, config)
        .then((res: any) => {
          const result: IResult = { res, err: null };
          resolve(result);
        })
        .catch((err: any) => {
          const result: IResult = { res: {}, err };
          resolve(result);
        });
    });
  }

  static get(parm: any, config?: object): any {
    return new Promise((resolve) => {
      axios
        .get(parm, config)
        .then((res: any) => {
          const result: IResult = { res, err: null };
          resolve(result);
        })
        .catch((err: any) => {
          const result: IResult = { res: {}, err };
          resolve(result);
        });
    });
  }

  static delete(parm: any, config?: object): any {
    return new Promise((resolve) => {
      axios
        .delete(parm, config)
        .then((res: any) => {
          const result: IResult = { res, err: null };
          resolve(result);
        })
        .catch((err: any) => {
          const result: IResult = { res: {}, err };
          resolve(result);
        });
    });
  }

  static put(parm: any, config?: object): any {
    return new Promise((resolve) => {
      axios
        .put(parm, config)
        .then((res: any) => {
          const result: IResult = { res, err: null };
          resolve(result);
        })
        .catch((err: any) => {
          const result: IResult = { res: {}, err };
          resolve(result);
        });
    });
  }
}
