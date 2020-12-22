import { message } from 'antd';
import { observable, action, configure, computed, runInAction } from 'mobx';
import { createHashHistory } from 'history';

import { logout } from './webapi';

const history = createHashHistory();

/* useStrict */
configure({
  enforceActions: 'observed',
});

class AppStore {
  @observable pathname = history.location.pathname; //当前页面hashPath
  @observable indexurl = '/main'; //默认路由地址
  @observable logout = false; //是否登出

  /**
   * 用户登出
   *
   * @memberof AppStore
   */
  @action userLogout = async () => {
    try {
      const res: any = await logout();
      if (res.status === 200) {
        runInAction(() => {
          this.logout = true;
        });
        message.success(res.result ? res.result : '操作成功');
      } else {
        message.error(res.message ? res.message : '操作成功');
      }
    } catch (error) {
      message.error(error.message ? error.message : '登出失败');
    }
  };

  /**
   * 改变属性状态
   *
   * @memberof Store
   */
  @action changeState = (state) => {
    Object.assign(this, state);
  };
}

export default new AppStore();
