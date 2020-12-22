import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import loadable from 'async-loadable';
import { Provider, observer } from 'mobx-react';

import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { ConfigProvider, message } from 'antd';
import 'antd/dist/antd.css';
import { createHashHistory } from 'history';

import routes from './routes';
import appStore from './store';
import { Decorator } from 'cake';
import { guid, tryGet, axios } from 'kit';
import ScrollToTop from './scroll-view';
import * as serviceWorker from './serviceWorker';
import './index.less';

const history = createHashHistory();

axios.get('static/config/global.json').then((res) => {
  const config = res.data;

  //全局配置注入window
  window['globalConfig'] = config;

  const TOKEN_KEY: string = process.env.TOKEN_KEY || 'geo-key';
  //保存基础URL到本地缓存
  localStorage.setItem('baseUrl', config.BASE_URL);
  localStorage.setItem(TOKEN_KEY, config.TOKEN);

  //监听路由改变
  history.listen((location, action) => {
    appStore.changeState({
      pathname: location.pathname,
    });
  });

  //设置提示框延迟
  message.config({
    duration: 1.5,
  });

  //初始化axios实例
  axios.setAxiosConfig(config, TOKEN_KEY);

  @observer
  class App extends Component<any> {
    config = {
      userInfo: true,
    };

    componentDidUpdate() {
      const { indexurl } = appStore;
      history.push(indexurl);
    }

    render() {
      const { indexurl } = appStore;

      return (
        <Provider appStore={appStore}>
          <ConfigProvider locale={zh_CN}>
            <Router>
              <ScrollToTop>
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => <Redirect to={indexurl} />}
                  />
                  <Decorator config={this.config} routes={routes}>
                    {this.renderRoute()}
                  </Decorator>
                </Switch>
              </ScrollToTop>
            </Router>
          </ConfigProvider>
        </Provider>
      );
    }

    /**
     * 渲染路由
     *
     * @memberof App
     */
    private renderRoute = () => {
      return routes.map((item, i) => (
        <Route
          key={i}
          exact={item.exact}
          path={item.path}
          component={loadable({ component: item.render })}
        />
      ));
    };
  }

  ReactDOM.render(<App />, document.getElementById('micro-app-root'));

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();

});
