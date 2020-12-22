import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import {
  registerMicroApps,
  start
} from 'qiankun';
import axios from 'axios';
import globalState from '@globalState';

const { Header } = Layout;

@observer
export default class CustomHeader extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.configMicroApp();
  }

  // 配置微应用
  private configMicroApp = () => {
    axios.get('static/config/microAppConfig.json')
      .then(microAppConfig => {
        const microConfig = microAppConfig.data.microApp || [];

        // 配置子项目
        registerMicroApps(microConfig.map(config => {
          const { activeRule, ...otherConfig } = config;
          return {
            ...otherConfig,
            activeRule (location) {
              return location.hash.startsWith(activeRule);
            },
            props: {
              globalState   // 将获取/更新全局状态的方法传递给子组件
            }
          }
        }));
        // 开始监听路由
        start();
      });
  }

  render() {
    return (
      <div className="decorator-header-wrap">
        <Header className="header-wrap">
          <div className="header-left">
            <ul className="header-nav">
              <li>
                <Link to="/main">主项目/首页</Link>
              </li>
              <li>
                <Link to="/test">主项目/测试</Link>
              </li>
              <li>
                <Link to="/micro-app/kgis-innerdata-0.0.1">子项目/内部数据管理平台</Link>
              </li>
              <li>
                <Link to="/micro-app/kmap-making-0.1.0">子项目/地图要素管理</Link>
              </li>
              <li>
                <Link to="/micro-app/kmap-icon-0.1.0">子项目/图标库</Link>
              </li>
            </ul>
          </div>
        </Header>
      </div>
    );
  };
}
